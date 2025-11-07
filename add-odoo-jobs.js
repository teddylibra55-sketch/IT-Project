// Using Node.js built-in fetch (available in Node 18+)

const BASE_URL = 'http://localhost:5000/api';

const odooJobs = [
  {
    title: "Senior Odoo Developer",
    company: "TechSolutions Pakistan",
    location: "Lahore, Pakistan",
    job_type: "remote",
    description: "We are looking for an experienced Senior Odoo Developer to join our dynamic team. You will be responsible for developing, customizing, and maintaining Odoo ERP modules. You will work on complex business logic, create custom modules, integrate third-party applications, and optimize Odoo performance. This is an excellent opportunity to work with cutting-edge ERP technology and contribute to innovative business solutions.",
    requirements: "4+ years of Odoo development experience, Python, PostgreSQL, XML, JavaScript, OWL Framework, REST API, Git, Strong understanding of Odoo architecture and module development, Experience with Odoo 14+ versions",
    salary_range: "PKR 150,000 - PKR 250,000"
  },
  {
    title: "Odoo Developer",
    company: "ERP Innovations Ltd",
    location: "Lahore, Pakistan",
    job_type: "onsite",
    description: "Join our team as an Odoo Developer and work on exciting ERP implementation projects. You will customize Odoo modules according to client requirements, develop new features, debug issues, and provide technical support. You will collaborate with cross-functional teams to deliver high-quality solutions that meet business needs.",
    requirements: "2+ years of Odoo development, Python programming, PostgreSQL database, XML/JSON, JavaScript, Odoo framework knowledge, Problem-solving skills, Good communication skills",
    salary_range: "PKR 100,000 - PKR 180,000"
  },
  {
    title: "Odoo ERP Developer",
    company: "Digital Business Systems",
    location: "Lahore, Pakistan",
    job_type: "remote",
    description: "We are seeking a skilled Odoo ERP Developer to develop and customize Odoo applications for our clients. You will work on module development, workflow automation, report generation, and system integration. This role offers the flexibility of remote work while contributing to meaningful business transformation projects.",
    requirements: "3+ years of Odoo development experience, Python, PostgreSQL, Odoo module development, XML, JavaScript, API integration, Strong analytical skills, Experience with Odoo customization and configuration",
    salary_range: "PKR 120,000 - PKR 200,000"
  },
  {
    title: "Junior Odoo Developer",
    company: "CloudTech Solutions",
    location: "Lahore, Pakistan",
    job_type: "onsite",
    description: "Perfect opportunity for a Junior Odoo Developer to start their career in ERP development. You will work under the guidance of senior developers to learn Odoo framework, develop basic modules, fix bugs, and assist in client implementations. We provide comprehensive training and mentorship to help you grow in your career.",
    requirements: "1+ year of Python development, Basic knowledge of Odoo, PostgreSQL basics, XML/HTML, JavaScript fundamentals, Eagerness to learn, Good problem-solving attitude, Computer Science degree or equivalent",
    salary_range: "PKR 60,000 - PKR 100,000"
  },
  {
    title: "Odoo Full Stack Developer",
    company: "InnovateERP",
    location: "Lahore, Pakistan",
    job_type: "hybrid",
    description: "We need an Odoo Full Stack Developer who can work on both backend and frontend aspects of Odoo applications. You will develop custom modules, create user interfaces using OWL framework, integrate APIs, and optimize database queries. This hybrid role offers flexibility with both remote and onsite work options.",
    requirements: "3+ years of full-stack development, Odoo framework expertise, Python, PostgreSQL, JavaScript, OWL Framework, REST/XML-RPC APIs, Frontend technologies (HTML, CSS), Git version control, Strong debugging skills",
    salary_range: "PKR 130,000 - PKR 220,000"
  },
  {
    title: "Odoo Technical Consultant",
    company: "Business Automation Experts",
    location: "Lahore, Pakistan",
    job_type: "remote",
    description: "Join us as an Odoo Technical Consultant where you will work on client implementations, provide technical guidance, develop custom solutions, and ensure successful Odoo deployments. You will interact with clients to understand their business requirements and translate them into technical solutions using Odoo platform.",
    requirements: "4+ years of Odoo experience, Python development, PostgreSQL, Odoo module customization, Client communication skills, Business process understanding, Technical documentation, Problem-solving abilities, Odoo certification preferred",
    salary_range: "PKR 160,000 - PKR 280,000"
  },
  {
    title: "Odoo Developer - E-commerce Specialist",
    company: "E-Commerce Solutions Pakistan",
    location: "Lahore, Pakistan",
    job_type: "onsite",
    description: "We are looking for an Odoo Developer with specialization in e-commerce modules. You will work on Odoo e-commerce implementations, integrate payment gateways, customize product catalogs, develop shopping cart functionality, and optimize online store performance. Experience with Odoo e-commerce modules is highly preferred.",
    requirements: "3+ years of Odoo development, E-commerce module experience, Python, PostgreSQL, Payment gateway integration, Odoo website builder, JavaScript, API integration, Understanding of e-commerce workflows",
    salary_range: "PKR 140,000 - PKR 230,000"
  },
  {
    title: "Odoo Developer - Manufacturing Module",
    company: "Industrial ERP Solutions",
    location: "Lahore, Pakistan",
    job_type: "remote",
    description: "Seeking an Odoo Developer with expertise in manufacturing and inventory management modules. You will customize manufacturing workflows, develop production planning features, integrate with machinery, and optimize inventory management processes. This role requires understanding of manufacturing business processes.",
    requirements: "3+ years of Odoo development, Manufacturing module experience, Python, PostgreSQL, Inventory management knowledge, Production planning understanding, BOM (Bill of Materials) expertise, Strong analytical skills",
    salary_range: "PKR 145,000 - PKR 240,000"
  }
];

async function addOdooJobs() {
  try {
    console.log('🚀 Adding Odoo Developer jobs to your IT Jobs website...\n');

    // Try to register first
    let token;
    try {
      console.log('📝 Registering as job poster...');
      const registerResponse = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Job Poster',
          email: 'poster@example.com',
          password: 'password123'
        })
      });
      const registerData = await registerResponse.json();
      if (registerResponse.ok) {
        token = registerData.token;
        console.log('✅ Successfully registered!\n');
      } else {
        throw new Error(registerData.message || 'Registration failed');
      }
    } catch (error) {
      // If registration fails, try to login
      console.log('📝 User already exists, trying to login...');
      try {
        const loginResponse = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'poster@example.com',
            password: 'password123'
          })
        });
        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          token = loginData.token;
          console.log('✅ Successfully logged in!\n');
        } else {
          throw new Error(loginData.message || 'Login failed');
        }
      } catch (loginError) {
        console.error('❌ Failed to login:', loginError.message);
        return;
      }
    }

    if (!token) {
      console.error('❌ Failed to get authentication token');
      return;
    }

    console.log('📝 Adding Odoo Developer jobs...\n');

    // Post each job
    for (let i = 0; i < odooJobs.length; i++) {
      try {
        console.log(`📝 Posting Odoo Developer job ${i + 1}/${odooJobs.length}: ${odooJobs[i].title}...`);
        const response = await fetch(`${BASE_URL}/jobs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(odooJobs[i])
        });
        const data = await response.json();
        if (response.ok) {
          console.log(`✅ Job ${i + 1} posted successfully: ${odooJobs[i].title} (${odooJobs[i].job_type})`);
        } else {
          throw new Error(data.message || 'Failed to post job');
        }
      } catch (error) {
        console.error(`❌ Failed to post job ${i + 1}:`, error.message);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 All Odoo Developer jobs have been posted successfully!\n');
    console.log('You can now:');
    console.log('1. Visit http://localhost:3000 to see all the jobs');
    console.log('2. Search for "Odoo" to filter these jobs');
    console.log('3. Filter by location "Lahore" or "Pakistan"');
    console.log('4. Filter by job type "remote" or "onsite"');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the server is running on port 5000');
  }
}

addOdooJobs();

