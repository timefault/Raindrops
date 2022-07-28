m = a => console.log(`[info] ${typeof a} | ${a}`);
// var CIRCLE_COLOR = "rgba(0,0,0,.5)";
var CIRCLE_COLOR = "rgba(227,153,84,.5)";
var BACKGROUND_COLOR = "rgba(64, 19, 29)"
// var BACKGROUND_COLOR = "white";
const LINE_COLOR = "black";
const RADIUS_DEFAULT = 50;
const TIMER = 10;
const SPEED = 10;

const timer = 20;
function main() {   // since this is supporting a closure, i will make nonpure functions

    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
    }
    class Circle {
        constructor(x = 0, y = 0, r = 1) {
            this.x = x; this.y = y; this.r = r;
        }
    }

    function cls(/*canvas, ctx*/) {
        const temp = ctx.fillStyle || BACKGROUND_COLOR;
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0,/* how to access canvas properties? */canvas.width, canvas.height);
        return temp;
    }
    function drawCircle(circle) {
        if (!(typeof circle === "object" && circle.constructor === Circle)) { console.log("error"); return; }
        prevBackgroundColor = ctx.fillStyle;
        ctx.strokeStyle = CIRCLE_COLOR;
        ctx.fillStyle = CIRCLE_COLOR;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        // ctx.stroke();
        ctx.fill();
        ctx.fillStyle = prevBackgroundColor;
    }
    function drawBackground() {
        // temp = ctx.fillStyle || "white";
        prevBackgroundColor = ctx.fillStyle;
        // ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0,/* how to access canvas properties? */canvas.width, canvas.height);
        // ctx.fillStyle = temp;
        ctx.fillStyle = prevBackgroundColor;
    }
    function drawLine() {
        const p1 = new Point(0, canvas.height / 2 + RADIUS_DEFAULT + 1);
        const p2 = new Point(canvas.width, canvas.height / 2 + RADIUS_DEFAULT + 1);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    function getEdgeCircle() {
        let c1 = new Circle(canvas.width / 2, canvas.height / 2, 50);
        let c2;
        let dx, dy, rand;
        rand = Math.random() * 2 * Math.PI;
        dx = 2 * c1.r * Math.cos(rand) + c1.x;
        dy = 2 * c1.r * Math.sin(rand) + c1.y;
        c2 = new Circle(dx, dy, 50);
        return c2;
    }
    function walkAroundCircle(c0, c1, dt, pace = 100, radius = 50) {

        let t;
        let dx, dy;
        dt /= pace;

        t = Math.atan2(c1.y - c0.y, c1.x - c0.x);
        t = t + dt * 2 * Math.PI;   // cannot modulus with irrational number
        dx = 2 * c0.r * Math.cos(t) + c0.x; // dx here is the value and not the change, sorry for the notation
        dy = 2 * c0.r * Math.sin(t) + c0.y;
        c1 = new Circle(dx, dy, radius);
        console.log(dy);
        return c1;
    }
    let strikeDuration, prevBackgroundColor, prevCircleColor, isStrikeHappening = false, strikeElapsedTime = 0;
    let strikeColor = "rgba(79, 66, 29, .5)", dynamicStrikecolor;
    function lightningStrike() {        // <===============================||||| Work on this!!!!!
        //          After that, work on a snow fall function; interesting fall paths
        // invert colors for a duration on a random ranged interval
        // later use color gradient
        prevBackgroundColor = BACKGROUND_COLOR;
        // prevCircleColor = CIRCLE_COLOR;

        if ((Math.random() + (1 / (timer * timer))) > 1 && !isStrikeHappening) {
            isStrikeHappening = true;
            strikeDuration = Math.random();
            ctx.fillStyle = `rgba(79, 66, 29, ${(strikeDuration - strikeElapsedTime) / strikeDuration})`;
        }
        if (isStrikeHappening && strikeElapsedTime < strikeDuration) {
            strikeElapsedTime += deltaTime;
            ctx.fillStyle = `rgba(79, 66, 29, ${(strikeDuration - strikeElapsedTime) / strikeDuration})`;
            console.log("LIGHTNING STRIKE!!!!!!!!!!!!!!!")
        }
        else {
            isStrikeHappening = false;
            strikeElapsedTime = 0;
            ctx.fillStyle = BACKGROUND_COLOR;
        }
        console.log(isStrikeHappening);

    }


    function rainCircles(/*circles , intensity*/) {
        // farther away, smaller, slower
        // spawn raindrops on ranged random interval
        // delete raindrops when below canvas   <========================|||||  H E R E
        // track position of raindrops, add drops on ranged interval, delete when offscreen
        // pre-run array before draw



        let c;
        let hi, lo, randSize;
        let randTime, randHorizontal, randVertical;

        hi = 30;
        lo = 1;
        if (Math.random() + (1 / TIMER) > 1) {   // illusion of timer
            randHorizontal = Math.random() * canvas.width;
            randVertical = Math.random() * 10;
            randSize = Math.random() * hi + lo;
            randSize = Math.random() * randSize + lo;
            randSize = Math.random() * randSize + lo;

            // rand = Math.random() * 2 / intensity;
            c = new Circle(randHorizontal, randVertical, randSize);
            circles.push(c);
        }
        let circle; let end; let toRemove = [];
        for (let el in circles) {

            // proportional velocity size relationship
            circle = circles[el];
            circle.y += (circle.r * circle.r * deltaTime * SPEED);
            drawCircle(circle);
            if (circle.y > canvas.height + circle.r) {
                toRemove.push(el);
            }
        }
        if (toRemove.length !== 0) {
            toRemove.sort((a, b) => b - a);
            // console.log(toRemove);
            toRemove.map(el => { circles.splice(el, 1); });
            toRemove = [];
        }



    }
    function getCircles(num) {  // will it be better to make all raindrops first, or make one then run 
        const circles = [];
        let randSize, hi = 10, lo = 2, r;
        let c;
        let randHorizontal, randVertical;
        for (let i = 0; i < num; i++) {

            // get random sizes in range
            randSize = Math.random() * hi + lo;
            // get random position on top of screen
            randHorizontal = Math.random() * canvas.innerWidth;
            randVertical = Math.random() * - 10;
            c = new Circle(randHorizontal, randVertical, randSize);
            circles.push(c);
        }
        return circles;

    }

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.append(canvas);

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";

    let c0, c1, c2;
    // c0 = new Circle(canvas.width / 2, canvas.height / 2, 50);
    // c1 = getEdgeCircle();
    // c2 = getEdgeCircle();
    // c3 = getEdgeCircle();
    // drawCircle(c0);
    // drawCircle(c1);
    // drawLine();
    m('this completed');





    function preRun() {
        let c;
        let hi, lo, randSize;
        let randTime, randHorizontal, randVertical;
        let circle; let end; let toRemove = [];
        // console.log(circles);
        hi = 30;
        lo = 1;

        for (let i = 0; i < 86400 * 2; i++) {
            if (Math.random() + (1 / TIMER) > 1) {   // illusion of timer
                randHorizontal = Math.random() * canvas.width;
                randVertical = Math.random() * 10;
                randSize = Math.random() * hi + lo;
                randSize = Math.random() * randSize + lo;
                randSize = Math.random() * randSize + lo;

                // rand = Math.random() * 2 / intensity;

                c = new Circle(randHorizontal, randVertical, randSize);
                circles.push(c);
            }
            for (let el in circles) {

                // proportional velocity size relationship
                circle = circles[el];
                circle.y += (circle.r * circle.r * .007 * SPEED);
                // drawCircle(circle);
                if (circle.y > canvas.height + circle.r) {
                    toRemove.push(el);
                }
            }
            if (toRemove.length !== 0) {
                toRemove.sort((a, b) => b - a);
                // console.log(toRemove);
                toRemove.map(el => { circles.splice(el, 1); });
                toRemove = [];
            }
        }
    }









    // on next iteration, consider the animator first
    let start, elapsed; // my not need elapsed
    let lastRunTime, i = 0;

    let deltaTime;
    let previousTimestamp;
    const circles = [];
    ctx.fillStyle = BACKGROUND_COLOR;
    preRun();
    // console.log(circles);
    function step(timestamp) {                  // this would be the animation loop
        // console.log(circles);
        // console.time("execution time");
        if (!previousTimestamp) {
            start = previousTimestamp = performance.now() - timestamp;
        }
        deltaTime = (timestamp - previousTimestamp) / 1000;
        // c1 = walkAroundCircle(c0, c1, deltaTime, 100, 100);
        // c2 = walkAroundCircle(c0, c2, deltaTime, 22);
        // c3 = walkAroundCircle(c0, c3, deltaTime, 10);
        drawBackground();
        // drawLine();
        // drawCircle(c0);
        // drawCircle(c1);
        // drawCircle(c2);
        // drawCircle(c3);
        previousTimestamp = timestamp;
        // console.log(i); i++;
        // console.timeEnd("execution time");






        rainCircles();
        // lightningStrike();

        raf = window.requestAnimationFrame(step);
    }
    let raf = window.requestAnimationFrame(step);
}


main();
