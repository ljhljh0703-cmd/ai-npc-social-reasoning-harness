(function () {
  const axis = [
    {
      key: "speech",
      label: "발화 분석",
      icon: "contradiction",
      defaultValue: 82,
      mapping: "발화 모순, 책임 회피, 서사 일관성 포착"
    },
    {
      key: "crowd",
      label: "여론 분석",
      icon: "public_opinion",
      defaultValue: 76,
      mapping: "몰아가기, 동조 압력, 여론 흐름, 희생양 만들기 감지"
    },
    {
      key: "beneficiary",
      label: "수혜자 분석",
      icon: "target",
      defaultValue: 86,
      mapping: "누가 이득 보는가, 투표 기대값, 전략적 침묵/거짓말 분석"
    },
    {
      key: "interrogation",
      label: "심문 전략",
      icon: "question",
      defaultValue: 84,
      mapping: "질문 설계, 유예 판단, follow-up 추적, 핵심 역할 보호"
    }
  ];

  const players = [
    {
      id: "minjun",
      name: "민준",
      role: "시민",
      team: "village",
      asset: 1,
      x: 468,
      y: 356,
      tone: "차분한 기록자",
      thought: {
        baseline: "다수 의견을 따라가면 안전하다고 느낀다.",
        scaffold: "누가 이득을 보는지부터 정리해야 한다.",
        weak: "질문은 떠올리지만 다음 투표까지 추적이 이어지지 않는다."
      },
      longThought: {
        baseline: "수아가 조용하다는 말에 쉽게 끌린다. 지호의 말 바꾸기는 기억하지만 투표 근거로 연결하지 못한다.",
        scaffold: "첫 투표 전 지호의 수아 몰이를 보류하고, 지호 처형 뒤에는 준서가 침묵으로 얻는 이득을 재확인한다.",
        weak: "지호의 모순은 포착하지만 준서가 남은 늑대일 가능성을 다음 날까지 충분히 묶어 두지 못한다."
      }
    },
    {
      id: "seoyeon",
      name: "서연",
      role: "예언자",
      team: "village",
      asset: 2,
      x: 312,
      y: 272,
      tone: "검증 중심",
      thought: {
        baseline: "검사 결과를 직접 말하면 바로 표적이 될까 봐 흔들린다.",
        scaffold: "검사 결과를 질문 형태로 바꾸어 지호의 반응을 본다.",
        weak: "지호를 찌르지만 보호 요청과 후속 추적이 약하다."
      },
      longThought: {
        baseline: "지호가 늑대라는 단서를 가지고도 수아 침묵론에 대화가 빼앗기면서 발화가 흐려진다.",
        scaffold: "지호를 바로 찍기보다 지호가 수아를 몰아간 이유, 준서가 그 흐름에 올라탄 이유를 차례로 묻는다.",
        weak: "첫 질문은 성공하지만 밤 이후 자신이 제거되며 남은 마을이 준서를 끝까지 묶어 두지 못한다."
      }
    },
    {
      id: "jiho",
      name: "지호",
      role: "늑대",
      team: "wolf",
      asset: 3,
      x: 622,
      y: 274,
      tone: "빠른 몰이",
      thought: {
        baseline: "조용한 사람을 먼저 몰면 시선이 분산된다.",
        scaffold: "질문이 구체화되면 말 바꾸기가 드러날 수 있다.",
        weak: "첫날에는 잡히지만 준서를 보호할 흔적을 일부 남긴다."
      },
      longThought: {
        baseline: "수아를 희생양으로 세우고 준서가 동조하면 마을 표가 쉽게 흔들린다고 계산한다.",
        scaffold: "서연의 질문과 민준의 수혜자 분석이 겹치면서 수아 몰이의 이득 구조가 드러난다.",
        weak: "자신은 처형되지만 준서가 침묵을 유지하면 다음 날 마을이 다른 희생양을 찾을 가능성이 남는다."
      }
    },
    {
      id: "doyoon",
      name: "도윤",
      role: "가드",
      team: "village",
      asset: 4,
      x: 704,
      y: 404,
      tone: "방어적 관찰자",
      thought: {
        baseline: "의심을 받으면 역할을 숨긴 채 방어하는 데 급급하다.",
        scaffold: "서연을 보호하고, 지호의 회피 발화를 기록한다.",
        weak: "서연 보호 판단이 늦어져 다음 날 정보 축이 끊긴다."
      },
      longThought: {
        baseline: "수아 몰이에 반대하다가 오히려 역으로 표적이 된다. 자기 방어에 집중해 지호 추적이 끊긴다.",
        scaffold: "지호가 질문을 피하는 순간을 짚고, 밤에는 서연이 제거될 위험을 우선순위로 둔다.",
        weak: "첫날 논리에는 동참하지만 밤 보호 우선순위를 잘못 잡아 follow-up 리더를 잃는다."
      }
    },
    {
      id: "haeun",
      name: "하은",
      role: "마녀",
      team: "village",
      asset: 5,
      x: 600,
      y: 516,
      tone: "유예와 보존",
      thought: {
        baseline: "말이 많은 사람을 위험하게 보고 빠르게 정리하려 한다.",
        scaffold: "처형 유예와 핵심 역할 보호를 분리해서 판단한다.",
        weak: "유예는 말하지만 누구를 지켜야 할지 결론이 흐리다."
      },
      longThought: {
        baseline: "발화량을 위험 신호로 오해한다. 질문의 질보다 분위기에 밀린다.",
        scaffold: "도윤 처형은 정보 손실이 크다고 보고, 지호와 준서의 이득 구조를 다음 날까지 남긴다.",
        weak: "지호 처형까지는 동의하지만 준서 추적보다 수아의 침묵에 다시 흔들린다."
      }
    },
    {
      id: "junseo",
      name: "준서",
      role: "늑대",
      team: "wolf",
      asset: 6,
      x: 354,
      y: 518,
      tone: "전략적 침묵",
      thought: {
        baseline: "지호가 앞에서 몰면 나는 짧게 동조만 한다.",
        scaffold: "지호가 잡힌 뒤 침묵이 오히려 흔적으로 남는다.",
        weak: "지호가 잡혀도 마을의 follow-up이 끊기면 살아남을 수 있다."
      },
      longThought: {
        baseline: "지호의 수아 몰이에 짧게 올라타고, 이후에는 도윤 방어를 이상하게 보이도록 분위기를 만든다.",
        scaffold: "첫 늑대 처형 뒤 지호를 구하지 않은 투표와 침묵이 수혜자 분석의 대상이 된다.",
        weak: "서연이 제거되면 남은 마을이 지호와 내 연결을 충분히 복기하지 못한다고 본다."
      }
    },
    {
      id: "sua",
      name: "수아",
      role: "시민",
      team: "village",
      asset: 7,
      x: 230,
      y: 410,
      tone: "느린 확신",
      thought: {
        baseline: "조용했다는 이유로 표적이 되자 방어가 늦어진다.",
        scaffold: "조용함 자체보다 누가 그것을 이용하는지 봐야 한다.",
        weak: "지호 처형 뒤에도 다시 희생양이 될 위험이 남는다."
      },
      longThought: {
        baseline: "초반 발화량이 적다는 이유로 희생양이 된다. 단서가 아니라 인상으로 평가받는다.",
        scaffold: "자기 방어보다 지호와 준서가 자신의 침묵을 어떻게 이용했는지 되짚는다.",
        weak: "첫날은 살아남지만 둘째 날 follow-up이 약해지면 다시 표가 몰린다."
      }
    }
  ];

  const relationships = {
    baseline: {
      minjun: { jiho: 42, junseo: 35, sua: 68, doyoon: 54, seoyeon: 38, haeun: 40 },
      seoyeon: { jiho: 91, junseo: 48, sua: 38, doyoon: 32, minjun: 30, haeun: 28 },
      jiho: { sua: 76, doyoon: 62, seoyeon: 70, junseo: 18, minjun: 42, haeun: 35 },
      doyoon: { jiho: 60, junseo: 46, sua: 45, seoyeon: 25, minjun: 30, haeun: 28 },
      haeun: { doyoon: 58, sua: 52, jiho: 43, junseo: 38, seoyeon: 32, minjun: 34 },
      junseo: { sua: 72, doyoon: 55, jiho: 20, seoyeon: 46, minjun: 38, haeun: 36 },
      sua: { jiho: 50, junseo: 45, doyoon: 35, seoyeon: 25, minjun: 30, haeun: 28 }
    },
    weak: {
      minjun: { jiho: 84, junseo: 58, sua: 55, doyoon: 36, seoyeon: 24, haeun: 30 },
      seoyeon: { jiho: 96, junseo: 64, sua: 32, doyoon: 28, minjun: 24, haeun: 24 },
      jiho: { sua: 70, doyoon: 56, seoyeon: 78, junseo: 14, minjun: 46, haeun: 40 },
      doyoon: { jiho: 86, junseo: 52, sua: 42, seoyeon: 20, minjun: 24, haeun: 22 },
      haeun: { jiho: 82, junseo: 50, sua: 58, doyoon: 36, seoyeon: 30, minjun: 34 },
      junseo: { sua: 68, doyoon: 48, jiho: 18, seoyeon: 58, minjun: 44, haeun: 38 },
      sua: { jiho: 78, junseo: 54, doyoon: 36, seoyeon: 24, minjun: 28, haeun: 26 }
    },
    scaffold: {
      minjun: { jiho: 92, junseo: 84, sua: 28, doyoon: 24, seoyeon: 18, haeun: 22 },
      seoyeon: { jiho: 98, junseo: 78, sua: 24, doyoon: 20, minjun: 18, haeun: 18 },
      jiho: { sua: 72, doyoon: 64, seoyeon: 82, junseo: 16, minjun: 52, haeun: 48 },
      doyoon: { jiho: 90, junseo: 76, sua: 24, seoyeon: 16, minjun: 18, haeun: 18 },
      haeun: { jiho: 88, junseo: 78, sua: 30, doyoon: 22, seoyeon: 20, minjun: 20 },
      junseo: { sua: 76, doyoon: 62, jiho: 20, seoyeon: 74, minjun: 55, haeun: 50 },
      sua: { jiho: 86, junseo: 74, doyoon: 28, seoyeon: 22, minjun: 24, haeun: 24 }
    }
  };

  const votes = {
    day1: {
      baseline: [
        { target: "doyoon", count: 3, voters: ["jiho", "junseo", "haeun"] },
        { target: "sua", count: 2, voters: ["minjun", "doyoon"] },
        { target: "jiho", count: 2, voters: ["seoyeon", "sua"] }
      ],
      weak: [
        { target: "jiho", count: 4, voters: ["seoyeon", "minjun", "doyoon", "sua"] },
        { target: "sua", count: 2, voters: ["jiho", "junseo"] },
        { target: "doyoon", count: 1, voters: ["haeun"] }
      ],
      scaffold: [
        { target: "jiho", count: 5, voters: ["seoyeon", "minjun", "doyoon", "haeun", "sua"] },
        { target: "sua", count: 2, voters: ["jiho", "junseo"] }
      ]
    },
    day2: {
      baseline: [
        { target: "sua", count: 3, voters: ["jiho", "junseo", "minjun"] },
        { target: "jiho", count: 2, voters: ["sua", "haeun"] }
      ],
      weak: [
        { target: "sua", count: 3, voters: ["junseo", "minjun", "haeun"] },
        { target: "junseo", count: 2, voters: ["doyoon", "sua"] }
      ],
      scaffold: [
        { target: "junseo", count: 4, voters: ["minjun", "doyoon", "haeun", "sua"] },
        { target: "sua", count: 1, voters: ["junseo"] }
      ]
    }
  };

  const timeline = [
    {
      id: "setup",
      phase: "역할 배정",
      kind: "system",
      icon: "role_reveal",
      duration: 1700,
      variants: {
        baseline: {
          text: "7인 고정 판이 시작된다. 발표자 모드에서는 모든 역할과 내부 상태가 보인다.",
          labels: ["역할 공개", "fixture"]
        },
        weak: {
          text: "마을 스캐폴드가 낮은 강도로 켜졌다. 질문은 나오지만 후속 추적이 약할 수 있다.",
          labels: ["낮은 스캐폴드", "분기"]
        },
        scaffold: {
          text: "마을 스캐폴드가 발표용 기본값으로 켜졌다. 질문, 유예, 수혜자 분석, follow-up 추적을 관찰한다.",
          labels: ["발표 기본값", "추론 하네스"]
        }
      }
    },
    {
      id: "night1",
      phase: "1일차 밤",
      kind: "night",
      icon: "wolf",
      duration: 2600,
      nightActions: {
        presenter: [
          { icon: "wolf", actor: "지호", text: "-> 서연(예언자) 공격 시도" },
          { icon: "wolf", actor: "준서", text: "-> 서연(예언자) 공격 동조" },
          { icon: "crystal", actor: "서연", text: "-> 조사 지호(늑대)" },
          { icon: "shield", actor: "도윤", text: "-> 보호 서연(예언자)" },
          { icon: "witch", actor: "하은", text: "-> 포션 보류" }
        ],
        viewer: "밤 사이 사망자는 없었다."
      },
      variants: {
        baseline: { text: "밤 결과는 남지만 낮 토론에서 단서가 빠르게 흐려진다.", labels: ["단서 휘발"] },
        weak: { text: "서연은 지호 단서를 쥐었지만, 보호와 follow-up 설계가 불안정하다.", labels: ["질문 예고"] },
        scaffold: { text: "예언자 단서와 가드 보호가 살아남았다. 낮 토론의 핵심은 지호의 회피 반응이다.", labels: ["핵심 역할 보호", "단서 보존"] }
      }
    },
    {
      id: "d1-seoyeon",
      phase: "1일차 토론",
      kind: "speech",
      speaker: "seoyeon",
      icon: "question",
      duration: 3000,
      variants: {
        baseline: {
          text: "수아가 조용한데, 조용한 사람이 늑대일 수도 있어요.",
          labels: ["맥락 놓침", "침묵 과대평가"]
        },
        weak: {
          text: "지호님, 수아를 먼저 찍은 이유를 말해 주세요. 그런데 아직 다른 연결은 잘 모르겠어요.",
          labels: ["질문 설계", "후속 약함"]
        },
        scaffold: {
          text: "지호님, 밤 결과가 나오자마자 수아를 찍은 이유부터 듣고 싶어요. 조용함이 아니라 그 침묵을 누가 이용했는지가 중요해요.",
          labels: ["질문 설계", "희생양 감지"]
        }
      }
    },
    {
      id: "d1-jiho",
      phase: "1일차 토론",
      kind: "speech",
      speaker: "jiho",
      icon: "public_opinion",
      duration: 2800,
      variants: {
        baseline: {
          text: "수아가 말이 없잖아요. 정보가 없으면 조용한 사람부터 보는 게 맞죠.",
          labels: ["몰아가기", "근거 약함"]
        },
        weak: {
          text: "제가 먼저 말한 건 맞지만, 다들 수아가 이상하다고 느끼지 않았나요?",
          labels: ["책임 회피", "동조 압력"]
        },
        scaffold: {
          text: "제가 먼저 찍은 건 맞지만, 그건 그냥 흐름을 본 거예요. 딱히 수아를 몰려던 건 아니었어요.",
          labels: ["책임 회피", "발화 모순"]
        }
      }
    },
    {
      id: "d1-minjun",
      phase: "1일차 토론",
      kind: "speech",
      speaker: "minjun",
      icon: "target",
      duration: 3200,
      variants: {
        baseline: {
          text: "다들 수아를 보니까 저도 수아 쪽이 맞는 것 같아요. 지호는 말이 많아서 정보는 주고 있어요.",
          labels: ["동조", "단서 휘발"]
        },
        weak: {
          text: "지호가 수아를 미는 건 이상해요. 그래도 준서까지 연결하기엔 아직 근거가 약합니다.",
          labels: ["수혜자 분석", "유예"]
        },
        scaffold: {
          text: "지금 수아가 처형되면 가장 이득 보는 사람은 지호예요. 그리고 준서는 지호 말에 짧게만 올라탔습니다.",
          labels: ["수혜자 분석", "전략적 침묵"]
        }
      }
    },
    {
      id: "d1-doyoon",
      phase: "1일차 토론",
      kind: "speech",
      speaker: "doyoon",
      icon: "contradiction",
      duration: 2700,
      variants: {
        baseline: {
          text: "저는 수아보다 지호가 더 이상하다고 봅니다. 그런데 제가 의심받는 이유는 잘 모르겠네요.",
          labels: ["방어 집중"]
        },
        weak: {
          text: "지호가 질문을 피한 건 맞습니다. 오늘은 지호를 보되, 내일 연결을 다시 봐야 합니다.",
          labels: ["발화 모순", "follow-up 예고"]
        },
        scaffold: {
          text: "지호는 처음엔 정보 부족이라고 했다가, 방금은 흐름만 봤다고 했어요. 이유가 바뀌었습니다.",
          labels: ["발화 모순", "서사 일관성"]
        }
      }
    },
    {
      id: "d1-haeun",
      phase: "1일차 토론",
      kind: "speech",
      speaker: "haeun",
      icon: "defer",
      duration: 2600,
      variants: {
        baseline: {
          text: "말이 많은 쪽이 위험해 보이긴 해요. 도윤이 너무 방어적입니다.",
          labels: ["인상 판단"]
        },
        weak: {
          text: "수아 처형은 유예하고 지호부터 보죠. 단, 준서는 내일 다시 봐야 할 것 같습니다.",
          labels: ["유예 판단", "추적 미완"]
        },
        scaffold: {
          text: "수아 처형은 정보 손실만 큽니다. 오늘 지호를 보고, 지호에게 이득을 준 준서를 다음 후보로 남깁니다.",
          labels: ["유예 판단", "follow-up 추적"]
        }
      }
    },
    {
      id: "vote1",
      phase: "1일차 투표",
      kind: "vote",
      icon: "vote",
      voteKey: "day1",
      duration: 3600,
      variants: {
        baseline: {
          text: "순정 AI는 수아 몰이와 도윤 방어 반응에 흔들려 가드를 처형한다.",
          labels: ["몰아가기 실패", "역할 손실"]
        },
        weak: {
          text: "낮은 스캐폴드도 지호 처형에는 성공한다. 다만 준서 follow-up은 약하게 남는다.",
          labels: ["첫 늑대 처형", "후속 약함"]
        },
        scaffold: {
          text: "마을은 지호를 첫 늑대로 처형한다. 준서의 동조와 침묵이 다음 날 추적 후보로 고정된다.",
          labels: ["첫 늑대 처형", "follow-up 예약"]
        }
      }
    },
    {
      id: "night2",
      phase: "2일차 밤",
      kind: "night",
      icon: "wolf",
      duration: 2900,
      nightActions: {
        presenter: [
          { icon: "wolf", actor: "준서", text: "-> 서연(예언자) 공격 시도" },
          { icon: "crystal", actor: "서연", text: "-> 조사 준서(늑대)" },
          { icon: "shield", actor: "도윤", text: "-> 보호 서연(예언자)" },
          { icon: "witch", actor: "하은", text: "-> 회복 포션 보류" }
        ],
        viewer: "밤 사이 사망자는 없었다."
      },
      variants: {
        baseline: {
          text: "가드가 이미 처형되어 서연이 제거된다. 마을의 검증 축이 끊긴다.",
          labels: ["핵심 역할 손실"]
        },
        weak: {
          text: "지호는 잡았지만 보호 우선순위가 흔들려 서연이 제거된다. 남은 단서는 약해진다.",
          labels: ["follow-up 약화"]
        },
        scaffold: {
          text: "서연 보호가 성공한다. 준서 조사가 살아남아 다음 낮의 follow-up 단서가 된다.",
          labels: ["핵심 역할 보호", "단서 보존"]
        }
      }
    },
    {
      id: "d2-minjun",
      phase: "2일차 토론",
      kind: "speech",
      speaker: "minjun",
      icon: "target",
      duration: 3200,
      variants: {
        baseline: {
          text: "어제 도윤이 너무 방어적이었고, 오늘은 수아가 계속 조용합니다. 수아 쪽으로 가죠.",
          labels: ["맥락 붕괴", "희생양 반복"]
        },
        weak: {
          text: "지호 다음은 준서일 수도 있지만, 수아 침묵도 여전히 마음에 걸립니다.",
          labels: ["단서 흔들림", "추적 약함"]
        },
        scaffold: {
          text: "지호가 처형된 뒤 가장 이득 본 사람은 준서입니다. 어제 준서는 지호의 수아 몰이에 짧게 동조하고 빠졌어요.",
          labels: ["수혜자 분석", "투표 기대값"]
        }
      }
    },
    {
      id: "d2-sua",
      phase: "2일차 토론",
      kind: "speech",
      speaker: "sua",
      icon: "followup",
      duration: 2800,
      variants: {
        baseline: {
          text: "저는 그냥 늦게 말한 거예요. 그런데 다들 저를 보니까 설명하기 어렵네요.",
          labels: ["방어 실패"]
        },
        weak: {
          text: "준서가 지호에게 얹힌 건 맞지만, 제가 또 표적이 될까 봐 말이 조심스러워요.",
          labels: ["관계 단서", "압박"]
        },
        scaffold: {
          text: "제가 조용했다는 사실보다, 지호와 준서가 그걸 처형 근거로 만든 과정이 더 중요합니다.",
          labels: ["희생양 반박", "follow-up"]
        }
      }
    },
    {
      id: "d2-junseo",
      phase: "2일차 토론",
      kind: "speech",
      speaker: "junseo",
      icon: "contradiction",
      duration: 2800,
      variants: {
        baseline: {
          text: "저는 그냥 상황을 본 겁니다. 수아가 계속 애매한 건 사실이잖아요.",
          labels: ["책임 회피"]
        },
        weak: {
          text: "지호가 늑대였다고 해서 제가 늑대인 건 아니죠. 수아 쪽도 계속 봐야 합니다.",
          labels: ["거리두기", "희생양 재사용"]
        },
        scaffold: {
          text: "지호가 늑대였던 건 맞지만, 저는 그때 확신이 없었습니다. 수아 의심은 아직 남아 있어요.",
          labels: ["거리두기", "전략적 침묵"]
        }
      }
    },
    {
      id: "vote2",
      phase: "2일차 투표",
      kind: "vote",
      icon: "vote",
      voteKey: "day2",
      duration: 3600,
      variants: {
        baseline: {
          text: "순정 AI는 같은 희생양을 반복해 수아를 처형한다. 늑대 둘이 살아남아 게임이 끝난다.",
          labels: ["반복 몰이", "마을 패배"]
        },
        weak: {
          text: "낮은 스캐폴드는 첫 늑대 처형 뒤 follow-up을 잃고 수아 처형으로 흔들린다.",
          labels: ["follow-up 실패", "마을 패배"]
        },
        scaffold: {
          text: "마을은 준서를 두 번째 늑대로 처형한다. 첫 늑대 처형 뒤 follow-up 추적이 성공했다.",
          labels: ["두 번째 늑대 처형", "마을 승리"]
        }
      }
    },
    {
      id: "summary",
      phase: "최종 요약",
      kind: "result",
      icon: "report",
      duration: 4200,
      variants: {
        baseline: {
          text: "결과: 늑대 승리. 관찰 실패는 맥락 붕괴, 단서 휘발, 희생양 반복으로 정리된다.",
          labels: ["늑대 승리", "맥락 붕괴"]
        },
        weak: {
          text: "결과: 늑대 승리. 질문은 생겼지만 follow-up 추적이 약해 남은 늑대를 놓쳤다.",
          labels: ["늑대 승리", "follow-up 약함"]
        },
        scaffold: {
          text: "결과: 마을 승리. 질문, 유예, 수혜자 분석, follow-up 추적이 더 많이 관찰됐다.",
          labels: ["마을 승리", "추론 흐름 변화"]
        }
      }
    }
  ];

  const metrics = {
    baseline: {
      questions: 2,
      deferrals: 0,
      beneficiary: 0,
      followup: 0,
      bandwagonFlags: 0,
      contextDrops: 4,
      clueRetention: 1,
      final: "늑대 승리"
    },
    weak: {
      questions: 5,
      deferrals: 2,
      beneficiary: 2,
      followup: 1,
      bandwagonFlags: 2,
      contextDrops: 2,
      clueRetention: 3,
      final: "늑대 승리"
    },
    scaffold: {
      questions: 7,
      deferrals: 3,
      beneficiary: 4,
      followup: 4,
      bandwagonFlags: 3,
      contextDrops: 0,
      clueRetention: 5,
      final: "마을 승리"
    }
  };

  const realRunExample = {
    id: "step7m-rt23-seed58",
    label: "STEP7-M RT2.3 seed 58",
    sourceKind: "sanitized-real-run-display",
    condition: "full-village-scaffold-step7m-rt23",
    rawPath: "redacted-local-archive",
    sanitizedPath: "redacted-display-archive",
    baselineRawPath: "redacted-local-archive",
    baselineSanitizedPath: "redacted-display-archive",
    rawFile: "redacted-local-archive",
    sanitizedFile: "redacted-display-archive",
    sourceArchive: {
      raw: "redacted-local-archive",
      sanitized: "redacted-display-archive",
      note: "Public export keeps replay fields and source hashes only. Original run JSON is not bundled."
    },
    sourceHash: {
      rawSha256: "76bf3a931c1d9d58434f8a795b9abfb98e1b95f45e1d04aa73c28b01e5ad01e4",
      sanitizedSha256: "769786621039e9ae4bad4e1a41345771c0e0fefcd64de8ef42ebeea9dcd8d596",
      baselineRawSha256: "ee09ee9454e6cc9d5d29b15888e65599a9040b4e478ec5b05085d41e7d3d51ce",
      baselineSanitizedSha256: "7d317bbd8a504cc0e9316f276cfc02e80f74da803e0b4ebac62295e1d2072556"
    },
    note:
      "대표 run seed 58은 설명용 사례이며, 성능 판단은 RT2.3 N=20 전체 표를 기준으로 한다.",
    meta: {
      timestamp: "2026-06-28T06:35:28",
      model: "llama3.1:8b",
      arm: "full+village-scaffold-step7m-rt23",
      seed: 58,
      hygieneSanitized: true,
      hygieneReplacements: 0
    },
    baselineComparison: {
      condition: "full-step7m-rt23",
      timestamp: "2026-06-28T05:03:51",
      rawPath: "redacted-local-archive",
      sanitizedPath: "redacted-display-archive",
      metrics: {
        winner: "늑대",
        days: 2,
        roleInferenceAccuracy: 0.5,
        voteConsistency: 0.444,
        correctExecutions: 1
      },
      flow: "Day 1: 준서 처형, 실제 늑대. Day 2: 수아 처형, 실제 예언자. 결과: 늑대 승리."
    },
    rolesByPlayer: {
      minjun: "시민",
      seoyeon: "시민",
      jiho: "늑대",
      doyoon: "마녀",
      haeun: "가드",
      junseo: "늑대",
      sua: "예언자"
    },
    teamsByPlayer: {
      minjun: "village",
      seoyeon: "village",
      jiho: "wolf",
      doyoon: "village",
      haeun: "village",
      junseo: "wolf",
      sua: "village"
    },
    thoughts: {
      minjun: {
        short: "Night 1 사망자로 기록되어 낮 투표에는 참여하지 못한다.",
        long: "seed 58 scaffold game_history에서 민준은 Night 1에 하은과 함께 사망했다. 데모에서는 사건 축 보존을 위해 밤 행동 패널과 역할표에서만 드러난다."
      },
      seoyeon: {
        short: "준서의 설명이 왜 그런지 되묻고, Day 2에는 지호 처형 흐름에 남는다.",
        long: "서연은 시민으로 남아 Day 1 준서 표, Day 2 지호 표에 참여한다. 공개 발화에서는 준서의 애매한 설명을 계속 질문하는 축으로 표시한다."
      },
      jiho: {
        short: "Day 1에는 준서에게 표를 던지지만, Day 2에는 도윤으로 의심을 돌린다.",
        long: "지호는 늑대다. scaffold run에서는 Day 2 vote에서 도윤에게 표를 던졌고, 남은 마을 표가 지호로 모여 두 번째 늑대로 처형된다."
      },
      doyoon: {
        short: "준서의 민준 관련 설명을 반복해서 묻고 Day 2에는 지호에게 표를 모은다.",
        long: "도윤은 마녀로 기록된다. Day 1과 Day 2 모두 준서/지호의 설명 흐름을 되묻는 발화가 남아 있으며, 최종 투표에서는 지호 처형에 참여한다."
      },
      haeun: {
        short: "Night 1 사망자로 기록되어 투표에는 참여하지 못한다.",
        long: "하은은 가드지만 seed 58 scaffold game_history에서는 Night 1 killed 목록에 포함된다. 보호 성공 기록은 없다."
      },
      junseo: {
        short: "민준 관련 설명이 의심 대상이 되고 Day 1 첫 늑대로 처형된다.",
        long: "준서는 늑대다. Day 1 vote에서 지호, 도윤, 서연, 수아의 표가 준서에게 모였고, 실제 역할 늑대로 처형된다."
      },
      sua: {
        short: "예언자 단서가 남고 Day 1 준서 투표에 참여한다.",
        long: "수아는 예언자다. Night 1에는 민준을 시민으로 확인했고, Day 1에는 준서에게 투표한다. Night 2에 사망자로 기록된다."
      }
    },
    relationships: {
      minjun: { junseo: 70, jiho: 64, doyoon: 28, seoyeon: 22, haeun: 20, sua: 18 },
      seoyeon: { junseo: 88, jiho: 76, doyoon: 26, sua: 22, minjun: 18, haeun: 18 },
      jiho: { doyoon: 78, junseo: 20, seoyeon: 48, sua: 42, minjun: 36, haeun: 30 },
      doyoon: { junseo: 86, jiho: 84, seoyeon: 24, sua: 20, minjun: 18, haeun: 18 },
      haeun: { junseo: 62, jiho: 56, minjun: 24, seoyeon: 20, doyoon: 20, sua: 18 },
      junseo: { doyoon: 74, jiho: 18, seoyeon: 66, sua: 58, minjun: 52, haeun: 44 },
      sua: { junseo: 90, jiho: 76, doyoon: 26, seoyeon: 20, minjun: 18, haeun: 18 }
    },
    metrics: {
      winner: "마을",
      days: 2,
      roleInferenceAccuracy: 1.0,
      voteConsistency: 0.75,
      totalUtterances: 4,
      historyEvents: 4,
      voteRounds: 2,
      correctExecutions: 2,
      hygieneReplacements: 0,
      scaffoldLeak: 0,
      outOfWorld: 0,
      nonKorean: 0
    },
    timeline: [
      {
        id: "real-setup",
        phase: "기록 예시",
        kind: "system",
        icon: "role_reveal",
        duration: 1700,
        text: "기록 예시는 STEP7-M RT2.3 seed 58 scaffold run을 기준으로 한다. 이 대표 run은 설명용 사례이며, 성능 판단은 RT2.3 N=20 전체 표를 기준으로 한다.",
        labels: ["RT2.3 seed 58", "설명용 사례"]
      },
      {
        id: "real-night1",
        phase: "1일차 밤",
        kind: "night",
        icon: "crystal",
        duration: 2800,
        text: "Night 1에는 지호와 준서의 밤 공격으로 민준(시민), 하은(가드)이 사망했고, 예언자 수아는 민준을 시민으로 확인했다.",
        labels: ["game_history", "사건 축"],
        nightActions: {
          presenter: [
            { icon: "wolf", actor: "지호", text: "-> 민준(시민) kill" },
            { icon: "wolf", actor: "준서", text: "-> 하은(가드) kill" },
            { icon: "crystal", actor: "수아", text: "-> 조사 민준(시민)" },
            { icon: "shield", actor: "하은", text: "-> 보호 대상 기록 없음" },
            { icon: "witch", actor: "도윤", text: "-> 생존(마녀)" }
          ],
          viewer: "밤 사이 민준과 하은이 사망했다."
        }
      },
      {
        id: "real-d1-jiho",
        phase: "1일차 토론",
        kind: "speech",
        speaker: "jiho",
        icon: "public_opinion",
        duration: 2500,
        text: "민준이 자살이라고 하지만 너무 급했고 하은의 경우도 어이가 없다.",
        labels: ["여론 분석", "사망 해석"]
      },
      {
        id: "real-d1-junseo",
        phase: "1일차 토론",
        kind: "speech",
        speaker: "junseo",
        icon: "contradiction",
        duration: 2600,
        text: "민준이 너무 급하다고 생각하는데, 하은의 경우는 더 이상 자살이라고 믿을 수 없어요.",
        labels: ["발화 분석", "의심 대상"]
      },
      {
        id: "real-d1-seoyeon",
        phase: "1일차 토론",
        kind: "speech",
        speaker: "seoyeon",
        icon: "question",
        duration: 2600,
        text: "민준이 너무 급했다고 하던 준서가 왜 그런 생각을 한 것일까.",
        labels: ["질문 설계", "follow-up"]
      },
      {
        id: "real-d1-sua",
        phase: "1일차 토론",
        kind: "speech",
        speaker: "sua",
        icon: "question",
        duration: 2600,
        text: "하은이가 너무 급한 것처럼 보였다는 말을 들었는데, 정말 그렇지 않았어?",
        labels: ["심문 전략", "근거 요청"]
      },
      {
        id: "real-vote1",
        phase: "1일차 투표",
        kind: "vote",
        icon: "vote",
        duration: 3600,
        text: "Day 1 vote 결과 준서가 처형되었고, 실제 역할은 늑대였다.",
        labels: ["첫 늑대 처형", "투표정합성"],
        voteRows: [
          { target: "junseo", count: 4, voters: ["jiho", "doyoon", "seoyeon", "sua"] },
          { target: "doyoon", count: 1, voters: ["junseo"] }
        ]
      },
      {
        id: "real-night2",
        phase: "2일차 밤",
        kind: "night",
        icon: "wolf",
        duration: 2600,
        text: "Night 2에는 지호의 밤 공격으로 수아(예언자)가 사망했고, 예언자 기록에는 도윤이 마녀로 확인된 흐름이 남는다.",
        labels: ["사건 축", "역할 단서"],
        nightActions: {
          presenter: [
            { icon: "wolf", actor: "지호", text: "-> 수아(예언자) kill" },
            { icon: "crystal", actor: "수아", text: "-> 조사 도윤(마녀)" },
            { icon: "shield", actor: "하은", text: "-> 행동 불가(사망)" },
            { icon: "witch", actor: "도윤", text: "-> 마녀로 확인" }
          ],
          viewer: "밤 사이 수아가 사망했다."
        }
      },
      {
        id: "real-d2-jiho",
        phase: "2일차 토론",
        kind: "speech",
        speaker: "jiho",
        icon: "public_opinion",
        duration: 2600,
        text: "준서가 민준을 죽였다고 생각하는데, 그는 민준이 너무 급했다는 말이 있잖아.",
        labels: ["여론 분석", "거리두기"]
      },
      {
        id: "real-d2-doyoon",
        phase: "2일차 토론",
        kind: "speech",
        speaker: "doyoon",
        icon: "question",
        duration: 2600,
        text: "준서가 민준을 너무 급하게 생각했다고 말한 건 의미가 있나?",
        labels: ["질문 설계", "follow-up"]
      },
      {
        id: "real-d2-seoyeon",
        phase: "2일차 토론",
        kind: "speech",
        speaker: "seoyeon",
        icon: "followup",
        duration: 2600,
        text: "그게 준서가 정말 그랬을까?",
        labels: ["후속 추적", "발화 분석"]
      },
      {
        id: "real-vote2",
        phase: "2일차 투표",
        kind: "vote",
        icon: "vote",
        duration: 3600,
        text: "Day 2 vote 결과 지호가 처형되었고, 실제 역할은 늑대였다. 마을 승리로 종료된다.",
        labels: ["두 번째 늑대 처형", "마을 승리"],
        voteRows: [
          { target: "jiho", count: 2, voters: ["doyoon", "seoyeon"] },
          { target: "doyoon", count: 1, voters: ["jiho"] }
        ]
      },
      {
        id: "real-summary",
        phase: "최종 요약",
        kind: "result",
        icon: "report",
        duration: 4200,
        text: "결과: 마을 승리. 역할추론 1.000, 투표정합성 0.750. 이 run은 설명용 사례이며 전체 판단은 RT2.3 N=20 표를 기준으로 한다.",
        labels: ["마을 승리", "N=20 기준"]
      }
    ]
  };

  const finalResults = {
    experiment: "STEP7-M RT2.3 N=20",
    interpretation: "품질 통제 상태의 탐색적 양의 경향",
    disclaimer:
      "sanitized 결과는 표시용 품질 보정이며, raw 성능 지표를 재계산하지 않는다. 대표 run seed 58은 설명용 사례이며, 성능 판단은 RT2.3 N=20 표를 기준으로 한다.",
    baseline: {
      arm: "full-step7m-rt23",
      n: 20,
      villageWinRate: 0.2,
      roleInference: 0.317,
      voteConsistency: 0.334,
      rawQualityPass: "20/20",
      replacements: 0
    },
    scaffold: {
      arm: "full-village-scaffold-step7m-rt23",
      n: 20,
      villageWinRate: 0.3,
      roleInference: 0.383,
      voteConsistency: 0.353,
      rawQualityPass: "20/20",
      replacements: 0
    },
    delta: {
      villageWinRate: "+0.100",
      roleInference: "+0.066",
      voteConsistency: "+0.019"
    }
  };

  window.DEMO_DATA = {
    meta: {
      title: "AI 마피아 사회적 추론 시뮬레이터",
      version: "prototype-harness-0.2",
      dataStatus: "fixture + STEP7-M RT2.3 seed58 real-run example",
      sourceStatus: "Fixture는 구조 검증용이다. 기록 예시는 STEP7-M RT2.3 seed 58 scaffold run을 기준으로 하며, 브라우저 payload는 성능 재계산 근거가 아니다.",
      claim: "품질 통제 상태의 탐색적 양의 경향. 대표 run은 설명용 사례이며, 성능 판단은 RT2.3 N=20 표를 기준으로 한다."
    },
    axis,
    players,
    relationships,
    votes,
    timeline,
    metrics,
    realRunExample,
    finalResults
  };
})();
