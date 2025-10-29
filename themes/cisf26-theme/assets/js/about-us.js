let snapTime;
let animateFunc;
let seamlessLoop;
let playhead;
let wrapTime;
let scrub;
let trigger;
let progressToScroll;
let rawSequence;
let cycleDuration;
let dur;
let cards;

function buildSeamlessLoop(items, spacing, animateFunc) {
	rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
			paused: true,
			repeat: -1, // to accommodate infinite scrolling/looping
			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			},
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 100); // seamless looping backwards
      }
		}),
		cycleDuration = spacing * items.length,
		dur; // the duration of just one animateFunc() (we'll populate it in the .forEach() below...

	// loop through 3 times so we can have an extra cycle at the start and end - we'll scrub the playhead only on the 2nd cycle
	items.concat(items).concat(items).forEach((item, i) => {
		let anim = animateFunc(items[i % items.length]);
		rawSequence.add(anim, i * spacing);
		dur || (dur = anim.duration());
	});

	// animate the playhead linearly from the start of the 2nd cycle to its end (so we'll have one "extra" cycle at the beginning and end)
	seamlessLoop.fromTo(rawSequence, {
		time: cycleDuration + dur / 2
	}, {
		time: "+=" + cycleDuration,
		duration: cycleDuration,
		ease: "none"
	});
	return seamlessLoop;
}

// feed in an offset (like a time on the seamlessLoop timeline, but it can exceed 0 and duration() in either direction; it'll wrap) and it'll set the scroll position accordingly. That'll call the onUpdate() on the trigger if there's a change.
function scrollToOffset(offset) { // moves the scroll playhead to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
	console.log('should scroll to offset');
    let snappedTime = snapTime(offset),
		progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration(),
		scroll = progressToScroll(progress);
	if (progress >= 1 || progress < 0) {
		return wrap(Math.floor(progress), scroll);
	}
	trigger.scroll(scroll);
}

export function initAboutUs() {

    gsap.registerPlugin(ScrollTrigger);

    console.log('about us js');
    let iteration = 0;
    const tl = gsap.timeline();

    gsap.set('.cards li', { xPercent: 400, opacity: 0, scale: 0});

    const spacing = .1;
    snapTime = gsap.utils.snap(spacing);
    cards = gsap.utils.toArray('.cards li');

    animateFunc = element => {
        const tl = gsap.timeline();
        tl.fromTo(element, { scale: 0, opacity: 0}, { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false})
            .fromTo(element, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, 0);
        return tl;
    }
    seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
    playhead = {offset: 0}, // a proxy object we use to simulate the playhead position, but it can go infinitely in either direction and we'll just use an onUpdate to convert it to the corresponding time on the seamlessLoop timeline.
	wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()), // feed in any offset (time) and it'll return the corresponding wrapped time (a safe value between 0 and the seamlessLoop's duration)
	scrub = gsap.to(playhead, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
		offset: 0,
		onUpdate() {
			seamlessLoop.time(wrapTime(playhead.offset)); // convert the offset to a "safe" corresponding time on the seamlessLoop timeline
		},
		duration: 0.5,
		ease: "power3",
		paused: true
	}),
	trigger = ScrollTrigger.create({
		start: 0,
		onUpdate(self) {
			let scroll = self.scroll();
      
      console.log(self.scroll())
			if (scroll > self.end - 1) {
				wrap(1, 2);
			} else if (scroll < 1 && self.direction < 0) {
				wrap(-1, self.end - 2);
			} else {
				scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
				scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
			}
		},
		end: "+=3000",
    markers: true,
		pin: ".gallery"
	}),
	// converts a progress value (0-1, but could go outside those bounds when wrapping) into a "safe" scroll value that's at least 1 away from the start or end because we reserve those for sensing when the user scrolls ALL the way up or down, to wrap.
	progressToScroll = progress => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end),
	wrap = (iterationDelta, scrollTo) => {
		iteration += iterationDelta;
		trigger.scroll(scrollTo);
		trigger.update(); // by default, when we trigger.scroll(), it waits 1 tick to update().
	};

    // when the user stops scrolling, snap to the closest item.
    ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(scrub.vars.offset));

    document.querySelector(".next").addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));
    document.querySelector(".prev").addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));



    // tl.from([
    //     ".about-us-title span",
    //     ".about-us-subtitle span",
    //     ".about-us-description span",
    // ], {
    //     y: 100,
    //     opacity: 0,
    //     ease: "power4.out",
    //     skewY: 7,
    //     duration: 1.8,
    //     delay: 0.5,
    //     stagger: {
    //         amount: 0.3
    //     }
    // });

    // gsap.from(".organizer-card", {
    //     scrollTrigger: {
    //         trigger: ".organizers-section",
    //         start: "top 85%",
    //     },
    //     opacity: 0,
    //     y: 40,
    //     duration: 0.8,
    //     stagger: 0.15,
    //     ease: "power3.out"
    // });
}