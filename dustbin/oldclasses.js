class Obstacle{
  constructor(options) {
    this.timestart=options.timestart;
    this.duration=options.duration;
    this.paths=options.paths;
    this.type=options.type;
    this.subtype=options.subtype;
    //add a method that iterates through each of the paths presented by the obstacle

  }
}

class Path{
  constructor(effect,comment){
    this.comment=comment;
    this.effect=effect;
  }
}

class Task{
  constructor(options) {
    this.acceleration=options.acceleration;
    this.basespeed=options.basespeed;
    this.duration=options.duration;
    this.checkpoints=options.checkpoints;
    //add a function that checks if the next checkpoint will come up first in time, or the next global obstacle
  }
}
