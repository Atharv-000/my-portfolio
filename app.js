// app.js - client routing (History API) and page rendering
const root = document.getElementById('root');

const pages = {
  '/': renderHome,
  '/data-science': renderDataScience,
  '/video-editing': renderVideoEditing,
  '/resume': renderResume,
  '/contact': renderContact
};

function setActiveNav(path){
  const allNavButtons = document.querySelectorAll('.nav-btn, .mobile-nav-btn');
  allNavButtons.forEach(b=>{
    b.classList.toggle('active', b.dataset.path === path);
  });
}

function navigate(path, push = true){
  const render = pages[path] || renderNotFound;
  root.innerHTML = '';
  root.appendChild(render());
  setActiveNav(path);
  if(push) {
    // Use hash-based routing for better compatibility with static hosting (GitHub Pages, etc.)
    // This ensures page refreshes work correctly
    if(location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:') {
      // Local development - use normal routing
      try {
        history.pushState({path}, '', path);
      } catch(e) {
        // Fallback to hash routing if pushState fails
        location.hash = path;
      }
    } else {
      // Production/static hosting - use hash routing
      location.hash = path;
    }
  }
  // Re-setup navigation after page render
  setTimeout(()=>{
    setupNavButtons();
    setupMobileMenu();
  }, 50);
}

// Handle nav clicks
function setupNavButtons(){
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(b=>{
    b.addEventListener('click', ()=> {
      navigate(b.dataset.path);
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if(mobileMenu) mobileMenu.classList.add('hidden');
    });
  });
}

// Global function for mobile menu toggle (called from HTML)
window.toggleMobileMenu = function(){
  const mobileMenu = document.getElementById('mobile-menu');
  if(mobileMenu){
    mobileMenu.classList.toggle('hidden');
  }
};

// Handle mobile menu
let mobileMenuInitialized = false;
function setupMobileMenu(){
  // Only setup once
  if(mobileMenuInitialized) return;
  
  // Setup mobile nav button clicks
  const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
  mobileNavButtons.forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const path = this.dataset.path;
      navigate(path);
      const menu = document.getElementById('mobile-menu');
      if(menu) menu.classList.add('hidden');
    });
  });
  
  mobileMenuInitialized = true;
}

// Setup navigation - wait for DOM to be ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>{
    setupNavButtons();
    setupMobileMenu();
  });
} else {
  setupNavButtons();
  setupMobileMenu();
}

// Handle back/forward
window.addEventListener('popstate', (e)=>{
  const path = (e.state && e.state.path) || location.pathname;
  navigate(path, false);
});

// Initial route - handle page refresh
function initRoute(){
  let path = '/';
  
  // Check for hash-based routing first (for static hosting)
  if(location.hash && location.hash.length > 1){
    path = location.hash.substring(1);
  } 
  // Fall back to pathname for local development
  else {
    path = location.pathname;
    // Normalize common paths
    if(path === '' || path === '/' || path === '/index.html' || 
       path === '/my-portfolio/' || path === '/my-portfolio/index.html' ||
       path === '/my-portfolio') {
      path = '/';
    }
  }
  
  // Normalize path
  if(!path.startsWith('/')) path = '/' + path;
  
  // Set hash if not already set (for static hosting compatibility)
  if(!location.hash && path !== '/') {
    location.hash = path;
  }
  
  if(!pages[path]) {
    navigate('/', false);
  } else {
    navigate(path, false);
  }
}

// Initialize on load
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initRoute);
} else {
  initRoute();
}

// Handle hash changes (for static hosting and browser back/forward)
window.addEventListener('hashchange', ()=>{
  const path = location.hash.substring(1) || '/';
  if(pages[path]) {
    navigate(path, false);
  } else {
    navigate('/', false);
  }
});

/* ---------- Page renderers ---------- */

function createContainer(){
  const div = document.createElement('div');
  div.className = 'container page';
  return div;
}

function renderHome(){
  const c = createContainer();
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <h1>Hi — I'm Atharv Sharma <span class="dropdown-arrow" id="details-toggle">▼</span></h1>
    <div id="personal-details" class="personal-details hidden">
      <div class="detail-item"><strong>Email:</strong> <a href="mailto:atharv26101948@gmail.com">atharv26101948@gmail.com</a></div>
      <div class="detail-item"><strong>Number:</strong> <a href="tel:9079030867">9079030867</a></div>
      <div class="detail-item"><strong>Gender:</strong> MALE</div>
      <div class="detail-item"><strong>Location:</strong> Jaipur, India</div>
    </div>
    <p>I'm a Data Scientist. I'm also a Video Editor. These are separate professional tracks. In data science I build predictive models, analytics pipelines, and clear visualisations. In video I focus on motion graphics, pacing, color grading, sound, and editing craft.</p>
    <div>
      <button class="metal-btn" id="to-data">Explore Data Science</button>
      <button class="metal-btn" id="to-video" style="margin-left:12px">See Video Editing</button>
    </div>
  `;
  c.appendChild(hero);
  
  // Add dropdown toggle functionality
  setTimeout(()=>{
    const toggle = document.getElementById('details-toggle');
    const details = document.getElementById('personal-details');
    if(toggle && details){
      toggle.addEventListener('click', ()=>{
        details.classList.toggle('hidden');
        toggle.textContent = details.classList.contains('hidden') ? '▼' : '▲';
      });
    }
  }, 50);

  // My Work brief
  const work = document.createElement('section');
  work.className = 'page';
  work.innerHTML = `
    <div class="container">
      <h2 style="margin-top:6px">Achievements</h2>
      <div class="grid" id="achievements" style="margin-bottom:32px"></div>

      <h2 style="margin-top:6px">My Work</h2>
      <p class="muted">Explore my Data Science projects and my Video Editing work — kept distinct.</p>
      <div class="grid" id="work-cards"></div>
    </div>
  `;
  c.appendChild(work);

  // sample brief project cards
  const workCards = work.querySelector('#work-cards');
  const samples = [
    {title:'Sales Forecasting', summary:'Time-series model and dashboard', link:'https://sales-forecasting-prediction-model.streamlit.app/', external:true},
    {title:'Telecom User Behavior Analytics Dashboard', summary:'Segment users and monitor engagement KPIs', link:'https://github.com/Atharv-000/tellco_telecom_analysis_', external:true}
  ];
  samples.forEach(s=>{
    const card = document.createElement('div'); card.className='card';
    const targetAttr = s.external ? 'target="_blank" rel="noopener noreferrer"' : '';
    card.innerHTML = `<h3>${s.title}</h3><p>${s.summary}</p><div style="margin-top:12px"><a class="metal-btn" href="${s.link}" ${targetAttr}>Open</a></div>`;
    workCards.appendChild(card);
  });

  const achievementsGrid = work.querySelector('#achievements');
  const achievements = [
    {
      title: 'Data Analysis Internship',
      description: 'Completed an internship in the Data Analysis department at Magnemite Moto LLP, demonstrating strong analytical skills and a keen understanding of data-driven decision-making.'
    },
    {
      title: 'Certified UI/UX Professional',
      description: 'Successfully completed a one-month UI/UX Training & Internship program, gaining foundational knowledge and practical skills in creating compelling digital experiences.'
    }
  ];
  achievements.forEach(item=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
    achievementsGrid.appendChild(card);
  });

  // CTA button events
  setTimeout(()=>{
    document.getElementById('to-data').addEventListener('click', ()=> navigate('/data-science'));
    document.getElementById('to-video').addEventListener('click', ()=> navigate('/video-editing'));
  },50);

  return c;
}

function renderDataScience(){
  const c = createContainer();
  c.innerHTML = `
    <h2>Data Science</h2>
    <p class="muted">I build, deploy, and monitor predictive models, dashboards and run end-to-end analytics projects.</p>
    <h3 style="margin-top:18px">Goal</h3>
    <div class="card" style="margin-top:12px">
      <p>Turn data into actionable insights that drive business success.</p>
    </div>

    <h3 style="margin-top:22px">Services</h3>
    <div class="grid">
      <div class="card"><h3>Deploying & Monitoring Models</h3><p>Productionize models and track performance after launch.</p></div>
      <div class="card"><h3>Projects</h3><p>End-to-end projects and dashboards.</p></div>
      <div class="card"><h3>Workshops</h3><p>Hands-on workshops and syllabus-based courses.</p></div>
    </div>

    <h3 style="margin-top:22px">Example Projects</h3>
    <div id="ds-projects" class="grid" style="margin-top:12px"></div>

    <div style="text-align:center;margin-top:26px">
      <button class="metal-btn" id="get-started">Get Started</button>
    </div>
  `;

  // sample projects
  const projects = [
    {title:'EDA', summary:'Exploratory data analysis delivering clear insights.', link:'https://github.com/Atharv-000/EDA-on-housing-data', external:true},
    {title:'Sales Forecast', summary:'ARIMA + Prophet forecasting', link:'https://sales-forecasting-prediction-model.streamlit.app/', external:true},
    {title:'User Analytics', summary:'Behavior analytics and dashboards', link:'https://github.com/Atharv-000/User-Analytics-Jupyter-Notebook', external:true}
  ];
  const grid = c.querySelector('#ds-projects');
  projects.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const targetAttr = p.external ? 'target="_blank" rel="noopener noreferrer"' : '';
    card.innerHTML = `<h3>${p.title}</h3><p>${p.summary}</p><div style="margin-top:12px"><a class="metal-btn" href="${p.link}" ${targetAttr}>View</a></div>`;
    grid.appendChild(card);
  });

  const getStartedBtn = c.querySelector('#get-started');
  if(getStartedBtn){
    getStartedBtn.addEventListener('click', ()=> navigate('/contact'));
  }

  return c;
}

function renderVideoEditing(){
  const c = createContainer();
  c.innerHTML = `
    <h2>Video Editing</h2>
    <p class="muted">I focus on high-quality, narrative-driven video production: story structure, pacing, color grading, audio mixing, motion graphics and final mastering for broadcast and social platforms. This work is production-focused and separate from my Data Science practice.</p>

    <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">
      <a class="metal-btn" href="https://www.instagram.com/phantom_e.d.i.t.z_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">Follow on Instagram</a>
    </div>

    <h3 style="margin-top:22px">My Editing Works</h3>
    <p class="muted" style="margin-bottom:18px">Here are some examples of my video editing work showcasing different styles and techniques.</p>
    <div id="videos-grid" style="display:flex;flex-direction:column;gap:16px;margin-top:12px;max-width:100%">
      <div id="videos-row-1" style="display:flex;flex-direction:column;gap:16px"></div>
      <div id="videos-row-2" style="display:flex;gap:16px;width:100%"></div>
    </div>

    <h3 style="margin-top:28px">Client Work & Reviews</h3>
    <div id="clients-grid" class="grid" style="margin-top:12px"></div>
  `;

  // Video examples - arranged vertically one by one
  const videos = [
    {title: 'Promo Reel', src: 'assets/sample1.mp4'},
    {title: 'Fun Edit', src: 'assets/sample2.mp4'},
    {title: 'Motion Graphics', src: 'assets/sample3.mp4'},
    {title: 'Cinematic Edit', src: 'assets/sample4.mp4'}
  ];
  
  const row1 = c.querySelector('#videos-row-1');
  const row2 = c.querySelector('#videos-row-2');
  
  videos.forEach((v, idx)=>{
    const card = document.createElement('div');
    card.classList.add('video-card');
    const videoType = v.src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4';
    
    if(idx < 2) {
      card.classList.add('video-card--full');
      card.style.cssText = `border-radius:16px;background:var(--glass-bg);border:1px solid rgba(255,170,100,0.12);backdrop-filter:blur(12px);position:relative;overflow:hidden;box-shadow:inset 0 1px rgba(255,255,255,0.03),0 8px 30px rgba(0,0,0,0.6);width:100%`;
      card.innerHTML = `
        <video controls style="width:100%;height:auto;border-radius:14px;background:#000;display:block">
          <source src="${v.src}" type="${videoType}">
          Your browser does not support the video tag.
        </video>
      `;
      row1.appendChild(card);
    } else {
      card.classList.add('video-card--half');
      card.style.cssText = `border-radius:16px;background:var(--glass-bg);border:1px solid rgba(255,170,100,0.12);backdrop-filter:blur(12px);position:relative;overflow:hidden;box-shadow:inset 0 1px rgba(255,255,255,0.03),0 8px 30px rgba(0,0,0,0.6)`;
      card.innerHTML = `
        <video controls style="width:100%;height:auto;border-radius:14px;background:#000;display:block">
          <source src="${v.src}" type="${videoType}">
          Your browser does not support the video tag.
        </video>
      `;
      row2.appendChild(card);
    }
  });

  const clients = [
    {
      title: 'Client 1',
      review: '"Excellent work on our promotional videos. Atharv delivered high-quality edits with fast turnaround and great attention to detail. Highly professional and easy to work with."',
      experience: 'Produced multi-camera corporate videos with color grading, motion graphics, and final mastering for broadcast. Coordinated with creative teams and delivered under tight timelines.'
    },
    {
      title: 'Client 2',
      review: '"Great storytelling and technical skills. The final product exceeded our expectations. Atharv understood our vision and brought it to life beautifully."',
      experience: 'Created product launch and explainer videos combining interviews, product footage and animated graphics. Handled storyboarding, audio cleanup, subtitle creation and platform-specific exports.'
    },
    {
      title: 'Client 3',
      review: '"Professional, reliable, and creative. Atharv managed our post-production seamlessly and delivered consistent quality across all deliverables."',
      experience: 'Managed end-to-end post-production for campaign videos including ingest, logging, assembly, color grading, audio mixing and motion graphics. Optimized content for multiple social platforms.'
    }
  ];
  
  const grid = c.querySelector('#clients-grid');
  clients.forEach(client=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h3>${client.title}</h3><p><strong>Review:</strong> ${client.review}</p><p style="margin-top:10px"><strong>Experience:</strong> ${client.experience}</p>`;
    grid.appendChild(card);
  });

  return c;
}

function renderResume(){
  const c = createContainer();
  c.innerHTML = `
    <h2>Resume</h2>
    <p class="muted">Download my resume and view my skills below.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a class="metal-btn" id="download-resume" href="/resume.pdf" download>Download Resume</a>
      <a class="metal-btn" href="https://www.linkedin.com/in/atharv-sharma-87290231b/" target="_blank" rel="noopener noreferrer">Visit LinkedIn</a>
      <a class="metal-btn" href="https://github.com/Atharv-000" target="_blank" rel="noopener noreferrer">Visit GitHub</a>
    </div>

    <h3 style="margin-top:22px">Skills & Languages</h3>
    <div id="skills" class="skill-grid"></div>
  `;

  const skills = [
    {name: 'Python', icon: 'python.jpeg'},
    {name: 'Pandas', icon: 'pandas.png'},
    {name: 'NumPy', icon: 'numpy.png'},
    {name: 'SQL', icon: 'sql.png'},
    {name: 'TensorFlow', icon: 'tenserflow.png'},
    {name: 'scikit-learn', icon: 'skitlearn.png'},
    {name: 'Premiere Pro', icon: 'premiere.svg'},
    {name: 'After Effects', icon: 'ae.png'},
    {name: 'DaVinci Resolve', icon: 'davinci.svg'},
    {name: 'JavaScript', icon: 'js.png'},
    {name: 'HTML5', icon: 'html.png'},
    {name: 'CSS3', icon: 'css.jpeg'}
  ];
  const skillsEl = c.querySelector('#skills');
  skills.forEach(s=>{
    const el = document.createElement('div'); el.className='skill';
    el.innerHTML = `<img src="assets/icons/${s.icon}" alt="${s.name}" class="icon" style="width:20px;height:20px;object-fit:contain"><span>${s.name}</span>`;
    skillsEl.appendChild(el);
  });

  return c;
}

function renderContact(){
  const c = createContainer();
  c.innerHTML = `
    <h2>Contact</h2>
    <p class="muted">Send me a message — it will be delivered directly to my inbox.</p>
    <form id="contact-form" aria-label="Contact form">
      <div class="field"><input name="name" placeholder="Your name" required></div>
      <div class="field"><input name="email" type="email" placeholder="Email" required></div>
      <div class="field"><textarea name="message" placeholder="Message" rows="5" required></textarea></div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="metal-btn" type="submit">Send Message</button>
        <div id="form-status" class="form-status" aria-live="polite"></div>
      </div>
    </form>
    <p style="margin-top:16px" class="muted">Alternatively email: <a href="mailto:atharv26101948@gmail.com" style="color:var(--accent)">atharv26101948@gmail.com</a></p>
  `;

  // attach submit handler
  setTimeout(()=>{
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      status.textContent = 'Sending...';
      const data = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      };
      try{
        const res = await fetch('https://formspree.io/f/xjkllknv', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(data)
        });
        const json = await res.json();
        if(res.ok){ status.textContent = 'Message sent successfully!'; form.reset(); } else { status.textContent = 'Error: ' + (json.error || 'Unable to send'); }
      }catch(err){
        status.textContent = 'Network error';
      }
    });
  },50);

  return c;
}

function renderNotFound(){
  const c = createContainer();
  c.innerHTML = `<h2>Page not found</h2><p class="muted">The page you requested does not exist.</p>`;
  return c;
}
