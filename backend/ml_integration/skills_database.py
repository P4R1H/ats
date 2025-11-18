"""Skills database for NLP extraction and matching."""

SKILLS_DATABASE = {
    "programming_languages": [
        "Python", "Java", "JavaScript", "C++", "C#", "Go", "Rust", "Ruby",
        "PHP", "Swift", "Kotlin", "TypeScript", "Scala", "R", "MATLAB", "Perl"
    ],
    "web_technologies": [
        "HTML", "CSS", "React", "Vue.js", "Angular", "Node.js", "Express",
        "Django", "Flask", "Spring Boot", "ASP.NET", "GraphQL", "REST APIs",
        "Webpack", "Next.js", "Nuxt.js", "Redux", "jQuery"
    ],
    "databases": [
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQL Server",
        "Redis", "Cassandra", "DynamoDB", "Firebase", "SQLite", "MariaDB",
        "Elasticsearch"
    ],
    "data_science": [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
        "Statistics", "Data Analysis", "Pandas", "NumPy", "Scikit-learn",
        "TensorFlow", "PyTorch", "Keras", "Jupyter", "Matplotlib", "Seaborn",
        "SciPy", "Feature Engineering", "MLOps"
    ],
    "cloud_devops": [
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "Terraform",
        "Ansible", "CI/CD", "DevOps", "Linux", "Bash", "Git", "GitHub",
        "GitLab", "Prometheus", "Grafana", "Microservices"
    ],
    "mobile": [
        "React Native", "Flutter", "Swift", "Kotlin", "Android Studio",
        "Xcode", "Mobile UI", "Firebase", "API Integration"
    ],
    "design": [
        "UI Design", "UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop",
        "Illustrator", "InVision", "Prototyping", "Wireframing", "User Testing",
        "Design Systems", "Accessibility", "Responsive Design", "Animation"
    ],
    "soft_skills": [
        "Communication", "Leadership", "Problem Solving", "Teamwork",
        "Project Management", "Agile", "Scrum", "Time Management"
    ],
    "other_technical": [
        "Testing", "Unit Testing", "Integration Testing", "Debugging",
        "Performance Optimization", "Security", "Cryptography", "Algorithms",
        "Data Structures", "OOP", "Design Patterns", "System Design"
    ]
}


def get_all_skills():
    """Get a flat list of all skills."""
    all_skills = []
    for category, skills in SKILLS_DATABASE.items():
        all_skills.extend(skills)
    return all_skills


def get_skills_by_category(category):
    """Get skills for a specific category."""
    return SKILLS_DATABASE.get(category, [])


def categorize_skill(skill):
    """Find which category a skill belongs to."""
    for category, skills in SKILLS_DATABASE.items():
        if skill in skills:
            return category
    return "other_technical"
