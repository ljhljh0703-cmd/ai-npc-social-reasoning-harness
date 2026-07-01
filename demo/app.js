(function () {
  const DATA = window.DEMO_DATA;
  const $ = (id) => document.getElementById(id);
  const playerById = new Map(DATA.players.map((player) => [player.id, player]));
  const iconPath = (name) => `assets/icons/${name}.png`;
  const PLAYER_STAGE_POSITIONS = {
    seoyeon: { x: 320, y: 246 },
    jiho: { x: 635, y: 246 },
    sua: { x: 228, y: 346 },
    minjun: { x: 480, y: 330 },
    doyoon: { x: 730, y: 344 },
    junseo: { x: 358, y: 405 },
    haeun: { x: 602, y: 405 }
  };

  const state = {
    source: "real",
    mode: "scaffold",
    view: "presenter",
    speed: 1.4,
    stepIndex: 0,
    selected: "minjun",
    thoughtOpen: false,
    npcTab: "relation",
    logOpen: false,
    playing: false,
    sliders: Object.fromEntries(DATA.axis.map((axis) => [axis.key, axis.defaultValue]))
  };

  let timer = null;
  let phaserGame = null;
  let sceneRef = null;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getAverageScore() {
    const values = Object.values(state.sliders);
    return Math.round(values.reduce((sum, value) => sum + Number(value), 0) / values.length);
  }

  function getBranch() {
    if (state.source === "real") return "real";
    if (state.mode === "baseline") return "baseline";
    const average = getAverageScore();
    const enoughFollowup = state.sliders.beneficiary >= 65 && state.sliders.interrogation >= 65;
    const enoughSignal = state.sliders.speech >= 55 && state.sliders.crowd >= 55;
    return average >= 70 && enoughFollowup && enoughSignal ? "scaffold" : "weak";
  }

  function getBranchLabel(branch = getBranch()) {
    if (branch === "real") return "실제 기록 예시";
    if (branch === "baseline") return "순정 AI";
    if (branch === "weak") return "저강도 스캐폴드";
    return "고강도 스캐폴드";
  }

  function labelIcon(label) {
    if (/질문|심문/.test(label)) return "question";
    if (/유예|보호/.test(label)) return "defer";
    if (/수혜|이득|기대|침묵/.test(label)) return "target";
    if (/여론|몰아|동조|희생양/.test(label)) return "public_opinion";
    if (/모순|책임|서사|맥락/.test(label)) return "contradiction";
    if (/follow|후속/.test(label)) return "followup";
    if (/승리|패배|처형/.test(label)) return "vote";
    return "report";
  }

  function filterLabels(labels, branch) {
    if (branch === "real") return labels;
    if (state.mode === "baseline" || branch === "baseline") return labels;

    const gates = [
      { key: "speech", re: /발화|모순|책임|서사|맥락/ },
      { key: "crowd", re: /여론|몰아|동조|희생양|압력/ },
      { key: "beneficiary", re: /수혜|이득|기대|침묵|전략/ },
      { key: "interrogation", re: /질문|유예|follow|후속|보호/ }
    ];

    const visible = labels.filter((label) => {
      const gate = gates.find((item) => item.re.test(label));
      return !gate || state.sliders[gate.key] >= 45;
    });

    if (visible.length) return visible;
    return branch === "weak" ? ["추론 약화"] : ["추론 흐름 변화"];
  }

  function materializeEvent(event) {
    const branch = getBranch();
    if (!event.variants) {
      return {
        ...event,
        branch,
        labels: filterLabels(event.labels || [], branch)
      };
    }
    const variant = event.variants[branch] || event.variants.scaffold || event.variants.baseline;
    return {
      ...event,
      branch,
      text: variant.text,
      labels: filterLabels(variant.labels || [], branch)
    };
  }

  function currentEvent() {
    return materializeEvent(getTimeline()[state.stepIndex]);
  }

  function getExecutedId(event) {
    if (event.executedId) return event.executedId;
    const rows = event.voteRows || (event.voteKey ? DATA.votes[event.voteKey]?.[event.branch] : null);
    if (!rows?.length) return null;
    return rows.reduce((top, row) => (row.count > top.count ? row : top), rows[0]).target;
  }

  function getNightEliminatedIds(event) {
    if (event.eliminatedIds) return event.eliminatedIds;
    return DATA.players
      .filter((player) => {
        const name = player.name;
        const deathWords = "사망|처형|kill|살해";
        const nameNearDeath = new RegExp(`${name}(?:이|가|은|는|을|를|와|과|,)?[^.。\\n]{0,12}(?:${deathWords})`);
        if (nameNearDeath.test(event.text || "")) return true;
        return (event.nightActions?.presenter || []).some((action) => {
          const text = action.text || "";
          return text.includes(name) && new RegExp(deathWords).test(text);
        });
      })
      .map((player) => player.id);
  }

  function getEliminatedIds(upToIndex = state.stepIndex) {
    const eliminated = new Set();
    getTimeline()
      .slice(0, upToIndex + 1)
      .map((event) => materializeEvent(event))
      .forEach((event) => {
        if (event.kind === "night") getNightEliminatedIds(event).forEach((id) => eliminated.add(id));
        if (event.kind === "vote") {
          const executed = getExecutedId(event);
          if (executed) eliminated.add(executed);
        }
      });
    return eliminated;
  }

  function playerName(id) {
    return playerById.get(id)?.name || id;
  }

  function getPlayerStagePosition(player) {
    return PLAYER_STAGE_POSITIONS[player.id] || { x: player.x, y: player.y };
  }

  function getTimeline() {
    return state.source === "real" ? DATA.realRunExample.timeline : DATA.timeline;
  }

  function getPlayerRole(player) {
    if (state.source === "real") {
      return DATA.realRunExample.rolesByPlayer[player.id] || player.role;
    }
    return player.role;
  }

  function getPlayerThought(player) {
    if (state.source === "real") {
      const realThought = DATA.realRunExample.thoughts[player.id];
      return state.thoughtOpen ? realThought.long : realThought.short;
    }
    const branch = getBranch();
    const thoughtKey = branch === "baseline" ? "baseline" : branch;
    return state.thoughtOpen ? player.longThought[thoughtKey] : player.thought[thoughtKey];
  }

  function renderAxisControls() {
    $("axis-sliders").innerHTML = DATA.axis
      .map((axis) => {
        const value = state.sliders[axis.key];
        return `
          <label class="axis-row" data-axis-row="${axis.key}">
            <div class="axis-label">
              <strong>${escapeHtml(axis.label)}</strong>
              <span id="axis-value-${axis.key}">${value}</span>
            </div>
            <input class="axis-range" data-axis="${axis.key}" type="range" min="0" max="100" value="${value}" />
            <p>${escapeHtml(axis.mapping)}</p>
          </label>
        `;
      })
      .join("");

    document.querySelectorAll(".axis-range").forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.axis;
        state.sliders[key] = Number(input.value);
        $(`axis-value-${key}`).textContent = input.value;
        renderAll();
        scheduleNext();
      });
    });
  }

  function updateControls() {
    $("source-fixture").classList.toggle("is-active", state.source === "fixture");
    $("source-real").classList.toggle("is-active", state.source === "real");
    $("mode-baseline").classList.toggle("is-active", state.mode === "baseline");
    $("mode-scaffold").classList.toggle("is-active", state.mode === "scaffold");
    $("view-presenter").classList.toggle("is-active", state.view === "presenter");
    $("view-viewer").classList.toggle("is-active", state.view === "viewer");
    $("play-toggle").querySelector("img").src = iconPath(state.playing ? "pause" : "play");
    $("play-toggle").title = state.playing ? "일시정지" : "재생";
    $("speed-label").textContent = `${state.speed.toFixed(1)}x`;
    $("branch-badge").textContent = getBranchLabel();
    document.body.dataset.source = state.source;
    document.body.dataset.branch = getBranch();
    $("data-badge").textContent =
      state.source === "real"
        ? `STEP7-M seed ${DATA.realRunExample.meta.seed}`
        : `fixture · ${DATA.meta.version}`;

    const sourceLocked = state.source === "real";
    $("mode-baseline").disabled = sourceLocked;
    $("mode-scaffold").disabled = sourceLocked;
    const disabled = sourceLocked || state.mode === "baseline";
    document.querySelectorAll(".axis-range").forEach((input) => {
      input.disabled = disabled;
      input.closest(".axis-row").classList.toggle("is-disabled", disabled);
    });

    $("log-toggle").textContent = state.logOpen ? "접기" : "펼치기";
    $("log-toggle").setAttribute("aria-expanded", String(state.logOpen));
    document.querySelector(".event-log-wrap").classList.toggle("is-open", state.logOpen);

    const timeline = getTimeline();
    const atStart = state.stepIndex <= 0;
    const atEnd = state.stepIndex >= timeline.length - 1;
    $("prev-step").disabled = atStart;
    $("next-step").disabled = atEnd;
    $("step-range").max = String(timeline.length);
    $("step-range").value = String(state.stepIndex + 1);
    $("playback-status").textContent = state.playing ? "재생 중" : atEnd ? "완료" : atStart ? "녹화 준비" : "일시정지";
    $("recording-cue").classList.toggle("is-hidden", state.playing || !atStart);
  }

  function renderLabels(event) {
    $("event-labels").innerHTML = event.labels
      .map(
        (label) => `
          <span class="label-chip">
            <img src="${iconPath(labelIcon(label))}" alt="" />
            ${escapeHtml(label)}
          </span>
        `
      )
      .join("");
  }

  function renderVotePanel(event) {
    const panel = $("vote-panel");
    if (event.kind !== "vote") {
      panel.classList.add("is-hidden");
      return;
    }

    const rows = event.voteRows || DATA.votes[event.voteKey][event.branch];
    const max = Math.max(...rows.map((row) => row.count));
    $("vote-list").innerHTML = rows
      .map((row) => {
        const width = Math.max(8, Math.round((row.count / max) * 100));
        return `
          <div class="vote-row">
            <img src="${iconPath("vote")}" alt="" />
            <strong>${escapeHtml(playerName(row.target))}</strong>
            <div class="vote-bar"><span style="width:${width}%"></span></div>
            <span>${row.count}표</span>
          </div>
        `;
      })
      .join("");
    panel.classList.remove("is-hidden");
  }

  function renderNightPanel(event) {
    const panel = $("night-panel");
    if (event.kind !== "night") {
      panel.classList.add("is-hidden");
      return;
    }

    if (state.view === "presenter") {
      $("night-list").innerHTML = event.nightActions.presenter
        .map(
          (action) => `
            <div class="night-row">
              <img src="${iconPath(action.icon)}" alt="" />
              <strong>${escapeHtml(action.actor)}</strong>
              <span>${escapeHtml(action.text)}</span>
            </div>
          `
        )
        .join("");
    } else {
      $("night-list").innerHTML = `
        <div class="night-row">
          <img src="${iconPath("role_hidden")}" alt="" />
          <strong>밤 결과</strong>
          <span>${escapeHtml(event.nightActions.viewer)}</span>
        </div>
      `;
    }

    panel.classList.remove("is-hidden");
  }

  function renderNightBanner(event) {
    const banner = $("night-action-banner");
    if (event.kind !== "night") {
      banner.classList.add("is-hidden");
      banner.innerHTML = "";
      return;
    }

    const rows =
      state.view === "presenter"
        ? event.nightActions.presenter
        : [{ icon: "role_hidden", actor: "밤 결과", text: event.nightActions.viewer }];
    banner.innerHTML = `
      <div class="night-banner-title">
        <span>${escapeHtml(event.phase)}</span>
        <strong>밤 행동 로그</strong>
      </div>
      <div class="night-banner-grid">
        ${rows
          .map(
            (action) => `
              <div class="night-banner-row">
                <img src="${iconPath(action.icon)}" alt="" />
                <strong>${escapeHtml(action.actor)}</strong>
                <span>${escapeHtml(action.text)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `;
    banner.classList.remove("is-hidden");
  }

  function getRoleText(player) {
    const role = getPlayerRole(player);
    if (state.view === "presenter") return role;
    if (currentEvent().kind === "result") return role;
    return "비공개";
  }

  function renderNpcPanel() {
    const player = playerById.get(state.selected);
    $("npc-name").textContent = player.name;
    $("npc-role").textContent = getRoleText(player);
    $("npc-tone").textContent = player.tone;
    $("npc-portrait").src = `assets/characters/player_${player.asset}_pose_1.png`;
    $("npc-thought").textContent = getPlayerThought(player);
    $("thought-toggle").textContent = state.thoughtOpen ? "1줄로 접기" : "상세 근거 펼치기";
    renderRelationshipMap(player.id, getBranch());
    renderEvidencePanel(player.id, getBranch());
    updateNpcTabs();
  }

  function updateNpcTabs() {
    document.body.dataset.npcTab = state.npcTab;
    document.querySelectorAll(".npc-tab").forEach((tab) => {
      const active = tab.dataset.npcTab === state.npcTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $("npc-panel-relation").classList.toggle("is-hidden", state.npcTab !== "relation");
    $("npc-panel-evidence").classList.toggle("is-hidden", state.npcTab !== "evidence");
    syncNpcPanelScroll();
  }

  function syncNpcPanelScroll() {
    const panel = document.querySelector(".right-rail");
    const evidencePanel = $("npc-panel-evidence");
    if (!panel || !evidencePanel) return;

    const usesInternalScroll = panel.scrollHeight > panel.clientHeight + 6 && window.matchMedia("(min-width: 980px)").matches;
    if (!usesInternalScroll) return;

    const target = state.npcTab === "evidence" ? Math.max(0, evidencePanel.offsetTop - 56) : 0;
    panel.scrollTo({ top: target, behavior: "auto" });
  }

  function suspicionColor(score) {
    if (score >= 75) return "#d86d5c";
    if (score >= 52) return "#f2bc57";
    return "#61b36f";
  }

  function renderRelationshipMap(selected, branch) {
    const sourceRelationships =
      state.source === "real" ? DATA.realRunExample.relationships : DATA.relationships[branch];
    const rel = sourceRelationships[selected] || {};
    const entries = Object.entries(rel).sort((a, b) => b[1] - a[1]);
    const centerX = 145;
    const centerY = 78;
    const radius = 64;
    const nodes = entries.map(([id, score], index) => {
      const angle = -Math.PI / 2 + (index / entries.length) * Math.PI * 2;
      return {
        id,
        score,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    const lines = nodes
      .map(
        (node) =>
          `<line x1="${centerX}" y1="${centerY}" x2="${node.x}" y2="${node.y}" stroke="${suspicionColor(
            node.score
          )}" stroke-width="${1.6 + node.score / 42}" opacity="0.72" />`
      )
      .join("");

    const nodeMarkup = nodes
      .map(
        (node) => `
          <g>
            <circle cx="${node.x}" cy="${node.y}" r="12" fill="${suspicionColor(node.score)}" opacity="0.9" />
            <text x="${node.x}" y="${node.y + 3}" text-anchor="middle" font-size="9" fill="#171b1e" font-weight="800">${escapeHtml(
              playerName(node.id).slice(0, 2)
            )}</text>
          </g>
        `
      )
      .join("");

    const list = entries
      .slice(0, 5)
      .map(
        ([id, score]) => `
          <div class="relation-item">
            <strong>${escapeHtml(playerName(id))}</strong>
            <div class="mini-bar"><span style="width:${score}%; background:${suspicionColor(score)}"></span></div>
            <span>${score}</span>
          </div>
        `
      )
      .join("");

    $("relationship-map").innerHTML = `
      <svg viewBox="0 0 290 170" role="img" aria-label="${escapeHtml(playerName(selected))} 중심 관계망">
        ${lines}
        <circle cx="${centerX}" cy="${centerY}" r="18" fill="#f6f2e8" />
        <text x="${centerX}" y="${centerY + 4}" text-anchor="middle" font-size="10" fill="#171b1e" font-weight="900">${escapeHtml(
      playerName(selected).slice(0, 2)
    )}</text>
        ${nodeMarkup}
      </svg>
      <div class="relation-list">${list}</div>
    `;
  }

  function renderEvidencePanel(selected, branch) {
    const event = currentEvent();
    const sourceRelationships =
      state.source === "real" ? DATA.realRunExample.relationships : DATA.relationships[branch];
    const rel = sourceRelationships[selected] || {};
    const topSuspicion = Object.entries(rel).sort((a, b) => b[1] - a[1])[0];
    const selectedPlayer = playerById.get(selected);
    const activeSpeaker = event.speaker ? playerName(event.speaker) : event.kind === "night" ? "밤 행동" : event.kind === "vote" ? "투표" : "상황";
    const evidence = [
      {
        label: "현재 장면",
        text: `${event.phase} · ${activeSpeaker}`,
        icon: labelIcon(event.labels?.[0] || event.phase)
      },
      {
        label: "주요 단서",
        text: event.labels?.slice(0, 2).join(" / ") || "단서 없음",
        icon: labelIcon(event.labels?.[0] || "report")
      },
      {
        label: "최대 의심",
        text: topSuspicion ? `${playerName(topSuspicion[0])} ${topSuspicion[1]}` : "관계 데이터 없음",
        icon: "suspicion"
      },
      {
        label: "내부 판단",
        text: getPlayerThought(selectedPlayer),
        icon: "role_hidden"
      }
    ];

    $("npc-evidence-list").innerHTML = evidence
      .map(
        (item) => `
          <article class="evidence-item">
            <img src="${iconPath(item.icon)}" alt="" />
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              <p>${escapeHtml(item.text)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderLog() {
    $("event-log").innerHTML = getTimeline()
      .slice(0, state.stepIndex + 1)
      .map((event, index) => {
        const item = materializeEvent(event);
        const labels = item.labels
          .slice(0, 2)
          .map((label) => `<span class="log-label">${escapeHtml(label)}</span>`)
          .join("");
        return `
          <article class="log-item ${index === state.stepIndex ? "is-current" : ""}">
            <header>
              <strong>${escapeHtml(item.phase)}</strong>
              <span>${index + 1}</span>
            </header>
            <p>${escapeHtml(item.text)}</p>
            <div class="label-row">${labels}</div>
          </article>
        `;
      })
      .join("");
  }

  function renderAll() {
    const event = currentEvent();
    const timeline = getTimeline();
    updateControls();
    $("phase-label").textContent = event.phase;
    $("step-counter").textContent = `${state.stepIndex + 1} / ${timeline.length}`;
    $("event-text").textContent = event.text;
    renderLabels(event);
    renderVotePanel(event);
    renderNightPanel(event);
    renderNightBanner(event);
    renderNpcPanel();
    renderLog();
    if (sceneRef) sceneRef.updateFromState();
  }

  function scheduleNext() {
    if (timer) window.clearTimeout(timer);
    if (!state.playing) return;
    const timeline = getTimeline();
    if (state.stepIndex >= timeline.length - 1) {
      state.playing = false;
      updateControls();
      return;
    }
    const event = timeline[state.stepIndex];
    timer = window.setTimeout(() => {
      state.stepIndex += 1;
      renderAll();
      scheduleNext();
    }, Math.max(700, event.duration / state.speed));
  }

  function resetRun() {
    state.stepIndex = 0;
    state.playing = false;
    renderAll();
    scheduleNext();
  }

  function replayRun() {
    state.stepIndex = 0;
    state.playing = true;
    renderAll();
    scheduleNext();
  }

  function stepBy(delta) {
    setStep(state.stepIndex + delta);
  }

  function togglePlayback() {
    if (!state.playing && state.stepIndex >= getTimeline().length - 1) {
      state.stepIndex = 0;
    }
    state.playing = !state.playing;
    renderAll();
    scheduleNext();
  }

  function setStep(index) {
    const timeline = getTimeline();
    state.stepIndex = Math.max(0, Math.min(timeline.length - 1, Number(index) || 0));
    state.playing = false;
    renderAll();
    scheduleNext();
  }

  function downloadLog() {
    const branch = getBranch();
    const timeline = getTimeline().map((event) => materializeEvent(event));
    const isReal = state.source === "real";
    const payload = {
      payloadKind: isReal ? "display_replay" : "fixture_replay",
      metricUse: isReal
        ? "Display replay only. Use the linked raw run and metric scripts for research evidence."
        : "Fixture branch table for presentation interaction tests. Not experimental evidence.",
      meta: DATA.meta,
      generatedAt: new Date().toISOString(),
      source: state.source,
      mode: state.mode,
      view: state.view,
      branch,
      branchLabel: getBranchLabel(branch),
      replayContract: {
        canonicalEventAxis: isReal ? "game_history" : "fixture_timeline",
        performanceClaimAllowed: false,
        rawMetricsRecomputedInBrowser: false,
        sanitizedUsedForDisplayOnly: isReal
      },
      sourceFiles: isReal
        ? {
            rawFile: DATA.realRunExample.rawFile,
            sanitizedFile: DATA.realRunExample.sanitizedFile,
            sourceArchive: DATA.realRunExample.sourceArchive,
            sha256: DATA.realRunExample.sourceHash
          }
        : null,
      sliders: state.sliders,
      players: DATA.players,
      realRun: isReal ? DATA.realRunExample : null,
      votes: isReal
        ? timeline.filter((event) => event.kind === "vote").map((event) => ({ id: event.id, rows: event.voteRows }))
        : {
            day1: DATA.votes.day1[branch],
            day2: DATA.votes.day2[branch]
          },
      metrics: isReal ? DATA.realRunExample.metrics : DATA.metrics[branch],
      timeline
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isReal
      ? `ai-mafia-demo-${DATA.realRunExample.id}-display-replay.json`
      : `ai-mafia-demo-${branch}-fixture-display-replay.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function bindControls() {
    $("source-fixture").addEventListener("click", () => {
      state.source = "fixture";
      state.stepIndex = 0;
      state.playing = false;
      renderAll();
      scheduleNext();
    });
    $("source-real").addEventListener("click", () => {
      state.source = "real";
      state.mode = "scaffold";
      state.stepIndex = 0;
      state.playing = false;
      renderAll();
      scheduleNext();
    });
    $("mode-baseline").addEventListener("click", () => {
      if (state.source === "real") return;
      state.mode = "baseline";
      renderAll();
      scheduleNext();
    });
    $("mode-scaffold").addEventListener("click", () => {
      if (state.source === "real") return;
      state.mode = "scaffold";
      renderAll();
      scheduleNext();
    });
    $("view-presenter").addEventListener("click", () => {
      state.view = "presenter";
      renderAll();
    });
    $("view-viewer").addEventListener("click", () => {
      state.view = "viewer";
      renderAll();
    });
    $("speed-range").addEventListener("input", (event) => {
      state.speed = Number(event.target.value);
      renderAll();
      scheduleNext();
    });
    $("play-toggle").addEventListener("click", togglePlayback);
    $("prev-step").addEventListener("click", () => stepBy(-1));
    $("next-step").addEventListener("click", () => stepBy(1));
    $("step-range").addEventListener("input", (event) => setStep(Number(event.target.value) - 1));
    $("reset-run").addEventListener("click", resetRun);
    $("replay-run").addEventListener("click", replayRun);
    $("download-log").addEventListener("click", downloadLog);
    $("log-toggle").addEventListener("click", () => {
      state.logOpen = !state.logOpen;
      renderAll();
    });
    document.querySelectorAll(".npc-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.npcTab = tab.dataset.npcTab;
        renderNpcPanel();
      });
    });
    $("thought-toggle").addEventListener("click", () => {
      state.thoughtOpen = !state.thoughtOpen;
      renderNpcPanel();
    });
    document.addEventListener("keydown", (event) => {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "BUTTON" || tag === "A" || event.target?.isContentEditable) return;
      if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepBy(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === "Home") {
        event.preventDefault();
        resetRun();
      } else if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        replayRun();
      }
    });
  }

  class VillageScene extends Phaser.Scene {
    constructor() {
      super("VillageScene");
      this.playerSprites = new Map();
      this.nameTexts = new Map();
      this.roleTexts = new Map();
      this.suspicionBars = new Map();
      this.tombstones = new Map();
      this.bubble = null;
      this.nightIcons = null;
      this.resultCard = null;
    }

    preload() {
      this.load.image("village-bg", "assets/environment/village_scene_bg.png");
      DATA.players.forEach((player) => {
        this.load.image(`player-${player.id}`, `assets/characters/player_${player.asset}_pose_1.png`);
      });
      [
        "wolf",
        "crystal",
        "shield",
        "witch",
        "vote",
        "question",
        "defer",
        "contradiction",
        "public_opinion",
        "target",
        "followup"
      ].forEach((icon) => this.load.image(`icon-${icon}`, iconPath(icon)));
    }

    create() {
      this.drawVillage();
      DATA.players.forEach((player) => this.createPlayer(player));
      sceneRef = this;
      this.updateFromState();
    }

    drawVillage() {
      this.add.image(0, 0, "village-bg").setOrigin(0).setDepth(0);
    }

    createPlayer(player) {
      const pos = getPlayerStagePosition(player);
      const shadow = this.add.ellipse(pos.x, pos.y + 40, 70, 22, 0x111111, 0.42);
      shadow.setStrokeStyle(2, 0xf2bc57, 0.14);
      shadow.setDepth(8);
      const sprite = this.add.image(pos.x, pos.y, `player-${player.id}`);
      sprite.setScale(0.72);
      sprite.setDepth(12);
      sprite.setInteractive({ useHandCursor: true });
      sprite.on("pointerdown", () => {
        state.selected = player.id;
        state.thoughtOpen = false;
        renderAll();
      });

      const roleText = this.add
        .text(pos.x, pos.y - 67, "", {
          fontFamily: '"Apple SD Gothic Neo", sans-serif',
          fontSize: "12px",
          color: "#fff7df",
          backgroundColor: "rgba(20,23,24,0.72)",
          padding: { x: 5, y: 3 }
        })
        .setOrigin(0.5)
        .setDepth(16);
      const nameText = this.add
        .text(pos.x, pos.y + 55, player.name, {
          fontFamily: '"Apple SD Gothic Neo", sans-serif',
          fontSize: "14px",
          color: "#f6f2e8",
          stroke: "#171b1e",
          strokeThickness: 4
        })
        .setOrigin(0.5)
        .setDepth(16);
      const barBack = this.add.rectangle(pos.x, pos.y + 72, 48, 5, 0x141718, 0.78).setOrigin(0.5).setDepth(15);
      const bar = this.add.rectangle(pos.x - 24, pos.y + 72, 1, 5, 0xf2bc57, 1).setOrigin(0, 0.5).setDepth(16);
      const tombstone = this.createTombstone(player);

      this.playerSprites.set(player.id, { sprite, shadow, barBack });
      this.nameTexts.set(player.id, nameText);
      this.roleTexts.set(player.id, roleText);
      this.suspicionBars.set(player.id, bar);
      this.tombstones.set(player.id, tombstone);
    }

    createTombstone(player) {
      const pos = getPlayerStagePosition(player);
      const container = this.add.container(pos.x, pos.y + 10);
      const stone = this.add.graphics();
      stone.fillStyle(0xd8d1c3, 0.96);
      stone.lineStyle(3, 0x545b5d, 0.95);
      stone.fillRoundedRect(-22, -38, 44, 58, 18);
      stone.strokeRoundedRect(-22, -38, 44, 58, 18);
      stone.fillStyle(0x9a9488, 1);
      stone.fillRect(-26, 18, 52, 12);
      stone.fillStyle(0x6f7678, 1);
      stone.fillRect(-4, -22, 8, 27);
      stone.fillRect(-13, -13, 26, 7);
      container.add([stone]);
      container.setDepth(12);
      container.setVisible(false);
      return container;
    }

    updateFromState() {
      const event = currentEvent();
      const branch = getBranch();
      const sourceRelationships =
        state.source === "real" ? DATA.realRunExample.relationships : DATA.relationships[branch];
      const selectedRel = sourceRelationships[state.selected] || {};
      const eliminated = getEliminatedIds();

      DATA.players.forEach((player) => {
        const entry = this.playerSprites.get(player.id);
        const selected = state.selected === player.id;
        const isEliminated = eliminated.has(player.id);
        entry.sprite.clearTint();
        entry.sprite.setVisible(!isEliminated);
        entry.barBack.setVisible(!isEliminated);
        entry.shadow.setScale(isEliminated ? 0.85 : 1);
        if (isEliminated) {
          entry.shadow.setFillStyle(0x111111, 0.48);
        } else if (selected) {
          entry.sprite.setScale(0.76);
          entry.shadow.setFillStyle(0xf2bc57, 0.42);
        } else {
          entry.sprite.setScale(0.72);
          entry.shadow.setFillStyle(0x111111, 0.42);
        }

        const role = state.view === "presenter" || event.kind === "result" ? getPlayerRole(player) : "???";
        this.roleTexts.get(player.id).setText(role);
        this.roleTexts.get(player.id).setStyle({
          color: "#fff7df",
          backgroundColor: "rgba(20,23,24,0.72)"
        });
        this.nameTexts.get(player.id).setAlpha(isEliminated ? 0.78 : 1);

        const score = player.id === state.selected ? 0 : selectedRel[player.id] || 0;
        const bar = this.suspicionBars.get(player.id);
        bar.setVisible(!isEliminated);
        bar.width = player.id === state.selected || isEliminated ? 0 : Math.max(4, Math.round(score * 0.48));
        bar.setFillStyle(score >= 75 ? 0xd86d5c : score >= 52 ? 0xf2bc57 : 0x61b36f, 1);

        const tombstone = this.tombstones.get(player.id);
        tombstone.setVisible(isEliminated);
        tombstone.setAlpha(selected ? 1 : 0.9);
      });

      this.updateSpeechBubble(event);
      this.updateNightIcons(event);
      this.updateResultCard(event);
    }

    updateSpeechBubble(event) {
      if (this.bubble) this.bubble.destroy(true);
      this.bubble = null;
      if (event.kind !== "speech" || !event.speaker) return;

      const player = playerById.get(event.speaker);
      const pos = getPlayerStagePosition(player);
      const width = 304;
      const x = Phaser.Math.Clamp(pos.x - width / 2, 18, 960 - width - 18);
      const y = Math.max(28, pos.y - 158);
      const container = this.add.container(x, y);
      const shadow = this.add.graphics();
      const bg = this.add.graphics();
      const name = this.add.text(12, 10, `${player.name}`, {
        fontFamily: '"Apple SD Gothic Neo", sans-serif',
        fontSize: "13px",
        color: "#6b4526",
        fontStyle: "700"
      });
      const tag = this.add.text(width - 72, 10, "공개 발화", {
        fontFamily: '"Apple SD Gothic Neo", sans-serif',
        fontSize: "11px",
        color: "#7a5a37",
        backgroundColor: "rgba(242,188,87,0.24)",
        padding: { x: 5, y: 2 }
      });
      const text = this.add.text(12, 34, event.text, {
        fontFamily: '"Apple SD Gothic Neo", sans-serif',
        fontSize: "15px",
        color: "#2b2118",
        lineSpacing: 3,
        wordWrap: { width: width - 24, useAdvancedWrap: true }
      });
      const height = Math.max(100, text.height + 52);
      const tailX = Phaser.Math.Clamp(pos.x - x, 26, width - 26);
      shadow.fillStyle(0x141718, 0.22);
      shadow.fillRoundedRect(4, 5, width, height, 8);
      bg.fillStyle(0xfff2cf, 0.96);
      bg.lineStyle(2, 0xe1a84f, 0.95);
      bg.fillRoundedRect(0, 0, width, height, 8);
      bg.strokeRoundedRect(0, 0, width, height, 8);
      bg.fillStyle(0xfff2cf, 0.96);
      bg.beginPath();
      bg.moveTo(tailX - 10, height - 1);
      bg.lineTo(tailX + 10, height - 1);
      bg.lineTo(tailX, height + 16);
      bg.closePath();
      bg.fillPath();
      bg.lineStyle(2, 0xe1a84f, 0.95);
      bg.lineBetween(tailX - 10, height, tailX, height + 16);
      bg.lineBetween(tailX, height + 16, tailX + 10, height);
      container.add([shadow, bg, name, tag, text]);
      container.setDepth(20);
      this.bubble = container;
    }

    updateNightIcons(event) {
      if (this.nightIcons) this.nightIcons.destroy(true);
      this.nightIcons = null;
      if (event.kind !== "night" || state.view !== "presenter") return;

      const container = this.add.container(0, 0);
      const g = this.add.graphics();
      container.add(g);
      const colorByIcon = {
        wolf: 0xd86d5c,
        crystal: 0x6da7d8,
        shield: 0x61b36f,
        witch: 0xa987d9
      };
      event.nightActions.presenter.forEach((action, index) => {
        const actorPlayer = DATA.players.find((player) => action.actor.includes(player.name));
        const actorPos = actorPlayer ? getPlayerStagePosition(actorPlayer) : null;
        const x = actorPos ? actorPos.x : 330 + index * 92;
        const y = actorPos ? actorPos.y - 112 : 176;
        const color = colorByIcon[action.icon] || 0xf2bc57;
        g.lineStyle(2, color, 0.4);
        g.lineBetween(x, y + 18, x, y + 72);
        g.fillStyle(color, 0.18);
        g.fillCircle(x, y + 74, 28);
        const plate = this.add.graphics();
        plate.fillStyle(0x141718, 0.78);
        plate.lineStyle(1, color, 0.75);
        plate.fillRoundedRect(x - 33, y - 19, 66, 54, 8);
        plate.strokeRoundedRect(x - 33, y - 19, 66, 54, 8);
        const icon = this.add.image(x, y, `icon-${action.icon}`).setScale(0.5);
        const label = this.add
          .text(x, y + 29, action.actor, {
            fontFamily: '"Apple SD Gothic Neo", sans-serif',
            fontSize: "12px",
            color: "#fff7df",
            stroke: "#171b1e",
            strokeThickness: 4
          })
          .setOrigin(0.5);
        container.add([plate, icon, label]);
      });
      container.setDepth(18);
      this.nightIcons = container;
    }

    updateResultCard(event) {
      if (this.resultCard) this.resultCard.destroy(true);
      this.resultCard = null;
      if (event.kind !== "result") return;

      const isVillage = /마을 승리/.test(event.text);
      const container = this.add.container(480, 172);
      const g = this.add.graphics();
      const title = isVillage ? "마을 승리" : "늑대 승리";
      const accent = isVillage ? 0x61b36f : 0xd86d5c;
      g.fillStyle(0x141718, 0.9);
      g.lineStyle(2, accent, 0.9);
      g.fillRoundedRect(-210, -72, 420, 144, 10);
      g.strokeRoundedRect(-210, -72, 420, 144, 10);
      g.fillStyle(accent, 0.16);
      g.fillRoundedRect(-190, -50, 380, 28, 6);
      const titleText = this.add
        .text(0, -36, title, {
          fontFamily: '"Apple SD Gothic Neo", sans-serif',
          fontSize: "24px",
          color: "#fff7df",
          fontStyle: "900"
        })
        .setOrigin(0.5);
      const flowText = this.add
        .text(0, 4, state.source === "real" ? "처형 흐름: 수아 → 하은" : "처형 흐름: 1일차 → 2일차", {
          fontFamily: '"Apple SD Gothic Neo", sans-serif',
          fontSize: "14px",
          color: "#f6f2e8"
        })
        .setOrigin(0.5);
      const noteText = this.add
        .text(0, 36, event.labels.join(" · "), {
          fontFamily: '"Apple SD Gothic Neo", sans-serif',
          fontSize: "12px",
          color: "#d8d1c3",
          wordWrap: { width: 360, useAdvancedWrap: true }
        })
        .setOrigin(0.5);
      container.add([g, titleText, flowText, noteText]);
      container.setDepth(22);
      this.resultCard = container;
    }
  }

  function bootPhaser() {
    phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "phaser-root",
      width: 960,
      height: 640,
      backgroundColor: "#2f6d49",
      pixelArt: true,
      roundPixels: true,
      scene: VillageScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    });
    window.demoPhaserGame = phaserGame;
  }

  window.demoApp = {
    getState: () => state,
    getBranch,
    currentEvent,
    resetRun,
    replayRun,
    setStep,
    downloadLog
  };

  renderAxisControls();
  bindControls();
  bootPhaser();
  renderAll();
})();
