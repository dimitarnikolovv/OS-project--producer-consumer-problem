import { EventEmitter } from 'events';

let cycle = 0;

let emitter = new EventEmitter();

emitter.on('produce', function (v) {
  console.log(`produce ${v}`);
});
emitter.on('consume', function (v) {
  console.log(`consume ${v}`);
});

emitter.on('full', function (arr) {
  consumer(arr).next();
});
emitter.on('empty', function (arr) {
  producer(arr).next();
});

function produce(arr, from = 0, to = 10) {
  if (from === to) {
    emitter.emit('full', arr);
    return;
  }

  emitter.emit('produce', from);
  produce((arr.push(from), arr), from + 1, to);
}

function consume(arr) {
  if (arr.length === 0) {
    emitter.emit('empty', arr);
    return;
  }

  emitter.emit('consume', arr[0]);
  consume((arr.shift(), arr));
}

function* producer(arr) {
  if (cycle === 100) return;

  cycle += 1;
  console.log(`\nCycle: ${cycle} \n`);
  produce(arr);
}

function* consumer(arr) {
  consume(arr);
}

export { producer };
