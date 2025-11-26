export function initAboutUsPage() {
    gsap.registerPlugin(ScrollTrigger);

    const parent = document.getElementById('roma-tre-university');
    const image = document.querySelector("#my-image");
    const helloText = document.querySelector('#hello');
    const textLeft = document.querySelector('.hero__text--left');
    const textRight = document.querySelector('.hero__text--right');

    /* Initial anim on page load
        helloText bumps out and img fades in
     */
    gsap.from(helloText, {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2
    });

    gsap.from(image, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power2.out",
        delay: 0.5
    });

    // Binding timeline to scroll event
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: parent,
            start: "top top",
            end: "+=150%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1
        }
    });

    // What happens on scroll
    tl.to(helloText, {
        opacity: 0,
        y: -50,
        duration: 0.2,
        ease: "power2.in"
    }, 0)
        .to(image, {
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            borderRadius: "0px",
            outlineWidth: "0px",
            top: "50%",
            left: "50%",
            duration: 1,
            ease: "power1.inOut"
        }, 0.1)
        .fromTo(textLeft, {
            opacity: 0,
            x: -100
        }, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out"
        }, 0.8)
        .fromTo(textRight, {
            opacity: 0,
            x: 100
        }, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out"
        }, 0.9);
}