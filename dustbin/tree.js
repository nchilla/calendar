let junctions=[
  {
    "id":[0,0],
    "type":"obstacle",
    "junctions":[
      {
        "id":[1,0],
        "type":"obstacle",
        "junctions":[
          {
            "id":[0],
            "type":"task",
            "duration":170,
            "init":0,
            "final":340,
            "junctions":[
              {
                "id":[0,0],
                "type":"task-obstacle",
                "junctions":[
                  
                ]
              }
              {
                "id":[0,1],
                "type":"task-obstacle",
                "junctions":[

                ]
              }
            ]
          }
        ],
      },
      {
        "id":[1,1],
        "type":"obstacle",
        "junctions":[

        ],
      },
    ],
  },
  {
    "id":[0,1],
    "type":"obstacle",
    "junctions":[

    ],
  }
]


let examplee={
  "id":[0],
  "type":"task",
  "duration":100,
  "junctions":[]
};

let globalObstacles=[
  {
    "subtype":"Distraction",
    "paths":[
      {
        "description":"Stayed focused.",
        "effects":[],
        "duration":0
      },
      {
        "description":"Went on a YouTube video bender",
        "effects":[],
        "duration":60
      }
    ]
  },
  {
    "subtype":"Philosophy reading",
    "paths":[
      {
        "description":"",
        "effects":[],
        "duration":90
      },
      {
        "description":"Something Descartes said led me on a long thought tangent, delaying completion by 30 minutes...",
        "effects":[],
        "duration":120
      }
    ]
  },
  {
    "subtype":"Sleep",
    "start":780,
    "paths":[
      {
        "description":"zzz",
        "effects":[],
        "duration":420
      },
    ]
  },
  {
    "subtype":"Alarm",
    "start":1230,
    "paths":[
      {
        "description":"Woke up immediately",
        "effects":[],
        "duration":0
      },
      {
        "description":"Snoozed every 5 minutes for an hour",
        "effects":[],
        "duration":60
      },
    ]
  },
  {
    "subtype":"Testing",
    "start":1380,
    "paths":[
      {
        "description":"Ran to get a quick covid test, in and out.",
        "effects":[],
        "duration":30
      },
      {
        "description":"Went to get a covid test at a mobile testing center, waited in line for an hour and a half.",
        "effects":[],
        "duration":90
      },
    ]
  },
  {
    "subtype":"Philosophy of mind course",
    "start":1560,
    "paths":[
      {
        "description":"Class went okay!",
        "effects":[],
        "duration":100
      },
      {
        "description":"I said something dumb during class and now I can't concentrate on the project.",
        "effects":["focus debuff"],
        "duration":100
      },
    ]
  },
  {
    "subtype":"Aesthetics course",
    "start":1680,
    "paths":[
      {
        "description":"Class went okay!",
        "effects":[],
        "duration":100
      },
      {
        "description":"That class session was so exhausting and stressful.",
        "effects":["focus debuff"],
        "duration":100
      },
    ]
  },
  {
    "subtype":"Friends",
    "start":1750,
    "paths":[
      {
        "description":"I got straight to work when I got home.",
        "effects":[],
        "duration":0
      },
      {
        "description":"A longtime friend asked to sleep over, and I ended up chatting with him and my roommates for a while. At least it put me in a good mood!",
        "effects":["progress buff"],
        "duration":90
      },
    ]
  },
];



let acceleration=2;

let tasks=[
  {
    "task":"concept brainstorming",
    "distance":"57600",
    "obstacles":[
      {
        "description":"I'm getting sidetracked researching things tangentially related to the project.",
        "effects":["focus debuff"],
        "duration":0
      },
      {
        "description":"Oh wow, I came up with an idea out of the blue that I'm really excited about!",
        "effects":["finish early"],
        "duration":0
      },
    ]
  },
  {
    "task":"visual design",
    "distance":"14400",
    "obstacles":[
      {
        "description":"I don't like where this is going. I have to start from scratch.",
        "effects":["start over"],
        "duration":0
      },
    ]
  },
  {
    "task":"fabrication",
    "distance":"14400",
    "obstacles":[
      {
        "description":"Why did I choose something so technically complex on such short notice?????????",
        "effects":["additional work"],
        "duration":60
      },
    ]
  }
]
