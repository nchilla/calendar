//i need some sort of container that actually has a tree structure and documents the acceleration and time in the day at each junction
const fs = require('fs');
const util = require('util');


let crosshair=[];

let junctions={
  "currentTask":{id:0,progress:0,acceleration:2,velocity:0},
  "type":"root",
  "minutes":0,
  "junctions":[],
  "lastObstacle":-1,
  "next":"obstacle"
}




// let minutes=0;
// let currentTask={id:0,progress:0,acceleration:2,velocity:0}


//junctions will need to record everything except for the crosshair at every step, so:
 //the minutes elapsed
 //the current task data
 //next item type

function fillJunctions(junction){
  // console.log(junction.currentTask);
  // console.log("proceeding to: ",junction.next);
  let nextOne;
  switch(junction.next){
    case "obstacle":
    // nextOne=globalObstacles.filter(a=>a.start>=junction.minutes)[0];
    nextOneId=globalObstacles.findIndex(a=>a.start>=junction.minutes);
    createPaths(junction,nextOneId,true);
    break;
    case "task-obstacle":
    nextOneId=junction.currentTask.id;
    createPaths(junction,nextOneId,false);
    break;
    case "task":
    createTaskPath(junction);
    break;
  }
}




function createTaskPath(junction){
  if(junction.currentTask.changeNext){
    junction.currentTask.progress=0;
    junction.currentTask.velocity=0;
    junction.currentTask.acceleration=2;
  }

  let decision=obstacleOrTaskObstacle(junction);
  let newTime=decision.time;
  let nextThing=decision.next;
  // console.log("decision:",decision);
  if(newTime==0&&nextThing=="task-obstacle"){
    return;
  }
  //so we now have time, which means we can solve for progress(distance) and velocity change using the formulas
  //we also need to check if the current task finishes before the allotment of time for the obstacle,
  //if it's a global
  let taskInfo={acceleration:junction.currentTask.acceleration};

  let progressed=junction.currentTask.velocity * decision.time + (0.5 * junction.currentTask.acceleration * Math.pow(decision.time,2));
  let whatIsLeft=tasks[junction.currentTask.id].distance-junction.currentTask.progress
  if(progressed>=whatIsLeft){
    progressed=whatIsLeft;
    newTime=solveForTime(progressed,junction.currentTask.velocity,junction.currentTask.acceleration);
    taskInfo.id=junction.currentTask.id==2?undefined:junction.currentTask.id+1;
    // taskInfo.progress=0;
    // taskInfo.velocity=0;
    // taskInfo.acceleration=2;
    taskInfo.changeNext=true;
    nextThing=taskInfo.id?nextThing:"filler";
  }else{
    taskInfo.id=junction.currentTask.id;
    // taskInfo.progress=junction.currentTask.progress+progressed;
    // taskInfo.velocity=junction.currentTask.velocity + newTime*junction.currentTask.acceleration;
  }
    taskInfo.progress=junction.currentTask.progress+progressed;
    taskInfo.velocity=junction.currentTask.velocity + newTime*junction.currentTask.acceleration;
  // if(junction.time)

  if(decision.time!==Infinity){
    // nextThing="filler";

    junction.junctions.push({
      "type":"task",
      "currentTask":taskInfo,
      "minutes":junction.minutes+newTime,
      "duration":newTime,
      "junctions":[],
      "lastObstacle":junction.lastObstacle,
      "next":nextThing
    })
    // console.log('called from task path');
    fillJunctions(junction.junctions[0]);
  }






}


function createPaths(junction,addingId,isGlobal){

  let adding=isGlobal?globalObstacles[addingId]:tasks[addingId];
  let looping=isGlobal?adding.paths:adding.obstacles;
  if(!isGlobal){
    console.log('looping: ',looping);
  }

  looping.forEach((item, i) => {
    junction.junctions.push({
      "type":isGlobal?"obstacle":"task-obstacle",
      "id":[addingId,i],
      "currentTask":returnNewTaskObject(junction,item.effects,item.duration),
      "minutes":junction.minutes+item.duration,
      "junctions":[],
      "lastObstacle":isGlobal?addingId:junction.lastObstacle,
      "next":"task"
    })
    fillJunctions(junction.junctions[i]);
  });
}


function returnNewTaskObject(oldJunction,effects,duration){
  let taskInfo={
    id:oldJunction.currentTask.id,
    progress:oldJunction.currentTask.progress,
    acceleration:2,
    velocity:duration>0?0:oldJunction.currentTask.velocity
  };
  if(effects.length>0){
    if(effects[0]=="focus buff"){
      taskInfo.acceleration=taskInfo.acceleration*2;
    }else if(effects[0]=="finish early"){
      taskInfo.id=taskInfo.id==2?undefined:taskInfo+1;
      taskInfo.progress=0;
      taskInfo.velocity=0;
    }else{
      taskInfo.acceleration=taskInfo.acceleration/2;
    }
  }
  return taskInfo;
}




// globalObstacles[0].paths.forEach((path, p) => {
//   addJunction(globalObstacles[0],path);
// });

function findJunction(array){
  let junctionLevel=junctions;
  array.forEach((item, i) => {
    junctionLevel=junctionLevel.junctions[item];
  });
  return junctionLevel;
}







function obstacleOrTaskObstacle(junction){
  let nextGlobal=globalObstacles.find((a,i)=>a.start>=junction.minutes&&i>junction.lastObstacle);
  let timeToNextGlobal=nextGlobal?(nextGlobal.start - junction.minutes):Infinity;
  let presentTask=tasks[junction.currentTask.id];
  let timeToNextCheckpoint=Infinity;
  if(presentTask){
    let halfDist=presentTask.distance/2;
    if(junction.currentTask.progress<halfDist){
      // here is where I need to use the formula to solve for the time using the distance and acceleration
      let dist=halfDist-junction.currentTask.progress;
      let v=junction.currentTask.velocity;
      let a=junction.currentTask.acceleration;
      timeToNextCheckpoint=solveForTime(dist,v,a);
      // if(v!==0){
      //   let solvedArr=quadEq(0.5 * a, v, dist * -1);
      //   timeToNextCheckpoint=Math.abs(solvedArr[0]);
      // }else{
      //   timeToNextCheckpoint=Math.sqrt(dist/0.5 * a);
      // }
      if(timeToNextGlobal<timeToNextCheckpoint){
        return {"next":"obstacle","time":Math.floor(timeToNextGlobal)};
      }else{
        return {"next":"task-obstacle","time":Math.floor(timeToNextCheckpoint)}
      }
    }

    return {"next":"obstacle","time":Math.floor(timeToNextGlobal)};


  }else if(nextGlobal){
    return {"next":"obstacle","time":Math.floor(timeToNextGlobal)};
  }else{
    //this is where you can direct it to do a killswitch
    return "lol";
  }

  //use this to decide how long a task interval should be
  //check what the closest task is to the current time position
  //check how long it'll take before the checkpoint is reached, if it isn't already met
  //return the shorter time interval and the task type
}


function solveForTime(dist,v,a){
  if(v!==0){
    let solvedArr=quadEq(0.5 * a, v, dist * -1);
    return Math.abs(solvedArr[0]);
  }else{
    return Math.sqrt(dist/0.5 * a);
  }
}

function quadEq(a, b, c) {
    var result = (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    var result2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    return [result,result2];
}



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
        "description":"",
        "effects":[""],
        "duration":0
      },
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
    "distance":"20000",
    "obstacles":[
      {
        "description":"",
        "effects":[""],
        "duration":0
      },
      {
        "description":"I don't like where this is going. I have to start from scratch.",
        "effects":["start over"],
        "duration":0
      },
    ]
  },
  {
    "task":"fabrication",
    "distance":"20000",
    "obstacles":[
      {
        "description":"Hard at work",
        "effects":[],
        "duration":0
      },
      {
        "description":"Why did I choose something so technically complex on such short notice?????????",
        "effects":["more work"],
        "duration":0
      },
    ]
  }
]

fillJunctions(junctions);


setTimeout(function () {
  fs.writeFile('/Users/hubblebot/Dropbox/bfacd/calendar/output2.json', JSON.stringify(junctions), err => {
    if (err) {
      console.error(err)
      return
    }
  })
}, 5000);
