let globalObstacles=[
  {
    "subtype":"Distraction",
    "start":0,
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
    "start":100,
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
    "start":1800,
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
        "effects":["more work"],
        "duration":0
      },
    ]
  }
]


window.addEventListener('load',initiate);

function initiate(){
  fetch('output.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    // console.log(data.junctions);
    // children(data);
    // Work with JSON data here

    let hierarchized=d3.hierarchy(data,function(d){return d.junctions; });
    console.log(hierarchized);
    children(hierarchized,[0]);
    for(var i=0; i<40; i=i+2){
      d3.select('#backgrid').append('div').attr('id','hour-'+i).attr('class','hour').append('code').text(i+" hours");
      if(i==0){
        d3.select('#hour-'+i).append('code').text("Wednesday noon");
      }else if(i==12){
        d3.select('#hour-'+i).append('code').text("Midnight");
      }else if(i==20){
        d3.select('#hour-'+i).append('code').text("Thursday morning");
      }
    }


  })



let crosshair=0;


function children(object,indexes){
  let parent=d3.select('#i'+indexes.join('-'));
  if(object.children){
    object.children.forEach((item, i) => {
      let indivArray=indexes.concat([i]);
      let str=indivArray.join('-');
      parent.select('.table')
      .append('li').attr('id','i'+str).attr('class','tree');
      let newEl=d3.select('#i'+str);
      newEl.node().dataset.type=item.data.type;
      // newEl.style("--duration",item.data.duration+'px');
      if(item.data.type!=="task"){
        newEl.node().dataset.index1=item.data.id[0];
        newEl.node().dataset.index2=item.data.id[1];
      }

      let itemContent;
      let duration;
      switch (item.data.type) {
        case "task":
        let vel1=Math.floor(object.data.currentTask.velocity/2);
        let vel2=Math.floor(item.data.currentTask.velocity/2);
        if(vel1 ==0 && vel2 ==0){
          vel2=70;
        }
        // switch(item.data.currentTask.id){
        //   case 0:
        //   newEl.style("--g",'255');
        //   break;
        //   case 1:
        //   newEl.style("--r",'255');
        //   break;
        //   case 2:
        //   newEl.style("--b",'255');
        //   break;
        // }
        newEl.style("--velocity1",vel1);
        newEl.style("--velocity2",vel2);
        // console.log(object.data.currentTask.velocity,item.data.currentTask.velocity);
        duration=item.data.duration;
        break;
        case "obstacle":
        itemContent=globalObstacles[item.data.id[0]].paths[item.data.id[1]];
        duration=itemContent.duration;
        // console.log(itemContent);
        break;
        case "task-obstacle":
        itemContent=tasks[item.data.id[0]].obstacles[item.data.id[1]];
        // console.log(itemContent);
        duration=itemContent.duration;
        break;
      }
      newEl.style("--duration",duration+'px');


      // newEl.node().dataset.index1=item.data.id[0];
      // newEl.node().dataset.index2=item.data.id[1];
      // newEl.style('--duration',item.data)
      newEl.append('span').attr('class','gap');
      newEl.append('ul').attr('class','table');
      newEl.append('div').attr('class','topbar');


      // new
      if(item.children){
        children(item,indivArray);
      }
    });

  }



  // let parent=d3.select('#d'+object.depth+"_"+crosshair);
  // console.log('#d'+object.depth+"_"+crosshair);
  // console.log(parent);
  // object.children.forEach((item, i) => {
  //   parent.append('div').attr('id','d'+item.depth+i);
  //   crosshair=i;
  //   if(item.children){
  //     children(item);
  //   }
  //
  // });



  //
  // if(junction.junctions.length>0){
  //   console.log(junction.minutes, "-----------");
  //
  //   junction.junctions.forEach((item, i) => {
  //
  //     // if(item.type=="obstacle"){
  //     //   console.log(globalObstacles[item.id[0]].paths[item.id[1]].description);
  //     // }else if(item.type=="task-obstacle"){
  //     //   console.log(tasks[item.id[0]].obstacles[item.id[1]].description);
  //     // }
  //     children(item);
  //   });
  // }
}

  // let data=fetch('/output.json');
  // console.log(data.json());
}


// console.log(globalObstacles,tasks);
