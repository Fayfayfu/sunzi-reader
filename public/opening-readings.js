// One-based addresses in the reader. Short excerpts retain the wording of their source rows.
const openingReadings = [
  [ // 1
    {"part":1,"start":1,"count":1,"excerpt":"兵者，国之大事，死生之地，存亡之道，不可不察也。","translationExcerpt":"用兵是一国的大事，关系一国的存亡，人民的死生，所以不能不慎重加以考虑！"},
    {"part":1,"start":2,"count":1},
    {"part":2,"start":1,"count":1},
    {"part":2,"start":3,"count":1},
    {"part":2,"start":5,"count":1},
    {"part":3,"start":2,"count":1,"excerpt":"势者，因利而制权也。","translationExcerpt":"但是兵势是不能预先定的，必须视敌人利害的情形，出于权变以制胜。"},
    {"part":3,"start":3,"count":1,"excerpt":"兵者，诡道也。","translationExcerpt":"用兵以诡诈为道"},
    {"part":3,"start":6,"count":1,"excerpt":"攻其无备，出其不意。","translationExcerpt":"攻击敌军空虚没有设防的地方，掩击敌军懈意不曾留意的去处。"},
    {"part":4,"start":1,"count":1},
    {"part":4,"start":2,"count":1}
  ],
  [ // 2
    {"part":1,"start":2,"count":1},
    {"part":1,"start":4,"count":1},
    {"part":1,"start":6,"count":1},
    {"part":2,"start":1,"count":2},
    {"part":3,"start":1,"count":2},
    {"part":5,"start":3,"count":1},
    {"part":6,"start":1,"count":1},
    {"part":6,"start":2,"count":1}
  ],
  [ // 3
    {"part":1,"start":1,"count":1,"excerpt":"全国为上，破国次之","translationExcerpt":"若能保全敌国，不必用武力去击破，令其自来降服，这方是上策。若用兵击破敌国，使之屈服，这就次一等了。"},
    {"part":1,"start":4,"count":1},
    {"part":2,"start":1,"count":1},
    {"part":3,"start":2,"count":1},
    {"part":4,"start":1,"count":2},
    {"part":5,"start":1,"count":1},
    {"part":7,"start":1,"count":5},
    {"part":8,"start":1,"count":3}
  ],
  [ // 4
    {"part":1,"start":1,"count":2},
    {"part":1,"start":3,"count":2},
    {"part":2,"start":3,"count":1},
    {"part":4,"start":1,"count":2},
    {"part":4,"start":4,"count":1},
    {"part":4,"start":5,"count":1},
    {"part":5,"start":4,"count":1}
  ],
  [ // 5
    {"part":1,"start":1,"count":2,"excerpt":"凡治众如治寡，分数是也；斗众如斗寡，形名是也","translationExcerpt":"分为部曲，编成队伍，各有统属，所以虽统治极多的兵，如同统治极少的兵一般简易。用旌旗识别，用金鼓节度，虽指挥极多的兵作战，如同指挥极少的兵一般有条不乱。"},
    {"part":2,"start":1,"count":1},
    {"part":2,"start":7,"count":2},
    {"part":3,"start":1,"count":2},
    {"part":3,"start":4,"count":1},
    {"part":4,"start":3,"count":2},
    {"part":6,"start":1,"count":2},
    {"part":6,"start":5,"count":1}
  ],
  [ // 6
    {"part":1,"start":3,"count":1},
    {"part":3,"start":2,"count":2},
    {"part":4,"start":3,"count":2},
    {"part":5,"start":1,"count":2},
    {"part":5,"start":5,"count":1},
    {"part":7,"start":8,"count":2},
    {"part":8,"start":1,"count":2},
    {"part":8,"start":3,"count":2}
  ],
  [ // 7
    {"part":1,"start":2,"count":1},
    {"part":2,"start":1,"count":2},
    {"part":2,"start":7,"count":1},
    {"part":3,"start":2,"count":3},
    {"part":4,"start":4,"count":1},
    {"part":5,"start":1,"count":3,"excerpt":"三军可夺气，将军可夺心。是故朝气锐，昼气惰，暮气归。故善用兵者，避其锐气，击其惰归，此治气者也"},
    {"part":5,"start":4,"count":2,"excerpt":"以治待乱，以静待哗，此治心者也；以近待远，以佚待劳，以饱待饥，此治力者也"},
    {"part":6,"start":4,"count":1,"excerpt":"围师必阙，穷寇勿迫"}
  ],
  [ // 8
    {"part":1,"start":4,"count":2},
    {"part":2,"start":1,"count":2},
    {"part":3,"start":1,"count":2},
    {"part":4,"start":1,"count":6}
  ],
  [ // 9
    {"part":2,"start":1,"count":1},
    {"part":4,"start":4,"count":1,"excerpt":"尘高而锐者，车来也；卑而广者，徒来也"},
    {"part":4,"start":6,"count":1,"excerpt":"辞卑而益备者，进也；辞强而进驱者，退也"},
    {"part":4,"start":14,"count":1},
    {"part":5,"start":3,"count":1},
    {"part":6,"start":1,"count":2},
    {"part":6,"start":3,"count":1},
    {"part":6,"start":4,"count":2}
  ],
  [ // 10
    {"part":1,"start":3,"count":1},
    {"part":2,"start":1,"count":1},
    {"part":3,"start":1,"count":1},
    {"part":3,"start":3,"count":1},
    {"part":3,"start":4,"count":1},
    {"part":4,"start":1,"count":2},
    {"part":5,"start":5,"count":1}
  ],
  [ // 11
    {"part":1,"start":6,"count":1},
    {"part":2,"start":3,"count":1},
    {"part":2,"start":4,"count":1},
    {"part":4,"start":1,"count":2},
    {"part":4,"start":3,"count":1,"excerpt":"夫吴人与越人相恶也，当其同舟而济。遇风，其相救也，如左右手。","translationExcerpt":"例如吴国人和越国人本是仇敌，是互相仇视的，可是当他们同舟共渡时，遇着风浪，他们会相救的，像左手和右手一般关切，一般一致。"},
    {"part":5,"start":1,"count":1},
    {"part":6,"start":1,"count":1},
    {"part":7,"start":7,"count":1},
    {"part":8,"start":4,"count":1}
  ],
  [ // 12
    {"part":1,"start":2,"count":1},
    {"part":2,"start":2,"count":1,"excerpt":"火发而其兵静者，待而勿攻，极其火力，可从而从之，不可从则止"},
    {"part":3,"start":1,"count":1},
    {"part":3,"start":2,"count":1,"excerpt":"非利不动，非得不用，非危不战。","translationExcerpt":"非见有利不出兵，非见其利可得必不用兵，非至危急必不开战。"},
    {"part":3,"start":3,"count":1},
    {"part":3,"start":4,"count":1},
    {"part":3,"start":5,"count":1}
  ],
  [ // 13
    {"part":1,"start":2,"count":2},
    {"part":1,"start":4,"count":1},
    {"part":1,"start":5,"count":1},
    {"part":2,"start":1,"count":1},
    {"part":3,"start":1,"count":2},
    {"part":4,"start":5,"count":1},
    {"part":5,"start":2,"count":2}
  ]
];
