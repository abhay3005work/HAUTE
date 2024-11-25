function page1() {
  // Custom Cursor
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");

  // Debounce mouse movement
  const mouseState = {
    x: 0,
    y: 0,
  };
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
    },
    { passive: true }
  );

  function updateCursor() {
    cursorX += (mouseState.x - cursorX) * 0.2;
    cursorY += (mouseState.y - cursorY) * 0.2;

    cursor.style.transform = `translate3d(${mouseState.x}px, ${mouseState.y}px, 0)`;
    cursorFollower.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    requestAnimationFrame(updateCursor);
  }

  updateCursor();

  // Menu Toggle
  const menuBtn = document.querySelector(".menu-btn");
  const menuOverlay = document.querySelector(".menu-overlay");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    menuOverlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Hero Canvas Animation
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const properties = {
    bgColor: "rgba(245, 239, 230, 1)",
    particleColor: "rgba(139, 111, 91, 0.5)",
    particleRadius: 3,
    particleCount: 60,
    particleMaxVelocity: 0.5,
    lineLength: 150,
    particleLife: 6,
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX =
        Math.random() * (properties.particleMaxVelocity * 2) -
        properties.particleMaxVelocity;
      this.velocityY =
        Math.random() * (properties.particleMaxVelocity * 2) -
        properties.particleMaxVelocity;
      this.life = Math.random() * properties.particleLife * 60;
    }

    position() {
      (this.x + this.velocityX > width && this.velocityX > 0) ||
      (this.x + this.velocityX < 0 && this.velocityX < 0)
        ? (this.velocityX *= -1)
        : this.velocityX;
      (this.y + this.velocityY > height && this.velocityY > 0) ||
      (this.y + this.velocityY < 0 && this.velocityY < 0)
        ? (this.velocityY *= -1)
        : this.velocityY;
      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    reDraw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
    }

    reCalculateLife() {
      if (this.life < 1) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.velocityX =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;
        this.velocityY =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 60;
      }
      this.life--;
    }
  }

  function reDrawBackground() {
    ctx.fillStyle = properties.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  function drawLines() {
    let x1, y1, x2, y2, length, opacity;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;
        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (length < properties.lineLength) {
          opacity = 1 - length / properties.lineLength;
          ctx.lineWidth = "0.5";
          ctx.strokeStyle = `rgba(139, 111, 91, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  function reDrawParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].reCalculateLife();
      particles[i].position();
      particles[i].reDraw();
    }
  }

  function loop() {
    reDrawBackground();
    reDrawParticles();
    drawLines();
    requestAnimationFrame(loop);
  }

  function init() {
    for (let i = 0; i < properties.particleCount; i++) {
      particles.push(new Particle());
    }
    loop();
  }

  init();

  // Handle window resize
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Intersection Observer for animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".collection-item, .lookbook-item, .season-title")
    .forEach((el) => {
      observer.observe(el);
    });

  // Image lazy loading
  document.querySelectorAll("img[data-src]").forEach((img) => {
    img.src = img.dataset.src;
    img.onload = () => {
      img.classList.add("loaded");
    };
  });

  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    const content = document.querySelector(".content");

    // Hide the loader
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        // Show the content
        content.style.opacity = "1";
      }, 1000);
    }, 2000);
  });

  // Add this loader animation code
  class LoaderAnimation {
    constructor() {
      this.canvas = document.getElementById("loaderCanvas");
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
      });

      this.init();
    }

    init() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.position.z = 5;

      // Create elegant fashion-themed particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);

      // Create a sphere distribution
      for (let i = 0; i < particleCount; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        positions[i * 3] = 40 * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = 40 * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = 40 * Math.cos(theta);
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xf5efe6,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
      this.scene.add(this.particles);

      // Add additional geometric shapes
      const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
      const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xf5efe6,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      this.torus = new THREE.Mesh(torusGeometry, torusMaterial);
      this.scene.add(this.torus);

      // Add floating lines
      this.lines = new THREE.Group();
      for (let i = 0; i < 50; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePoints = [];
        const startPoint = new THREE.Vector3(
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        );
        linePoints.push(startPoint);
        linePoints.push(
          new THREE.Vector3(
            startPoint.x + Math.random() * 2 - 1,
            startPoint.y + Math.random() * 2 - 1,
            startPoint.z + Math.random() * 2 - 1
          )
        );
        lineGeometry.setFromPoints(linePoints);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xf5efe6,
          transparent: true,
          opacity: 0.2,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.lines.add(line);
      }
      this.scene.add(this.lines);

      // Animate text
      this.animateText();

      this.animate();
    }

    animateText() {
      const letters = document.querySelectorAll(".loader-text span");

      gsap.fromTo(
        letters,
        {
          opacity: 0,
          scale: 0,
          y: 100,
          rotationX: -90,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationX: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power3.out",
          transformOrigin: "center center",
        }
      );
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      if (this.particles) {
        this.particles.rotation.y += 0.0005;
        this.particles.rotation.x += 0.0002;

        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const time = Date.now() * 0.0001;
          positions[i] = x * Math.cos(time) - z * Math.sin(time);
          positions[i + 2] = z * Math.cos(time) + x * Math.sin(time);
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Animate torus
      if (this.torus) {
        this.torus.rotation.x += 0.001;
        this.torus.rotation.y += 0.002;
        this.torus.rotation.z += 0.001;
      }

      // Animate lines
      if (this.lines) {
        this.lines.rotation.y += 0.001;
        this.lines.children.forEach((line, i) => {
          line.position.y = Math.sin(Date.now() * 0.001 + i) * 0.1;
        });
      }

      this.renderer.render(this.scene, this.camera);
    }

    resize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Update the window load event
  window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    const content = document.querySelector(".content");
    const loaderAnimation = new LoaderAnimation();

    window.addEventListener("resize", () => loaderAnimation.resize());

    // Enhanced exit animation
    const tl = gsap.timeline({
      delay: 3.5,
      onComplete: () => {
        setTimeout(() => {
          loader.style.display = "none";
          content.classList.add("visible");
        }, 1000);
      },
    });

    tl.to(".loader-text span", {
      opacity: 0,
      y: -100,
      rotationX: 90,
      stagger: 0.1,
      duration: 1,
      ease: "power2.in",
    }).to(
      loader,
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "-=0.5"
    );
  });
}
page1();
