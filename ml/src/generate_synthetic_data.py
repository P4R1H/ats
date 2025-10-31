"""
Generate synthetic resume data to augment the real dataset.

This script creates realistic resume data with:
- Various job categories
- Skills extraction
- Experience levels
- Education backgrounds
- Realistic text content
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)


class ResumeGenerator:
    """Generate synthetic resume data."""

    def __init__(self):
        self.job_categories = [
            'Data Science',
            'Web Development',
            'Mobile Development',
            'DevOps',
            'UI/UX Design',
            'Software Engineering',
            'Machine Learning',
            'Database Administration',
            'Network Engineering',
            'Cybersecurity'
        ]

        self.skills_by_category = {
            'Data Science': {
                'core': ['Python', 'R', 'Statistics', 'Machine Learning', 'SQL'],
                'tools': ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch',
                          'Jupyter', 'Matplotlib', 'Seaborn', 'SciPy'],
                'advanced': ['Deep Learning', 'NLP', 'Computer Vision', 'Time Series',
                            'Big Data', 'Spark', 'Hadoop', 'MLOps', 'Feature Engineering']
            },
            'Web Development': {
                'core': ['HTML', 'CSS', 'JavaScript', 'Git', 'REST APIs'],
                'tools': ['React', 'Vue.js', 'Angular', 'Node.js', 'Express',
                         'MongoDB', 'PostgreSQL', 'MySQL', 'Redux'],
                'advanced': ['TypeScript', 'GraphQL', 'Webpack', 'Next.js', 'Microservices',
                            'Docker', 'AWS', 'CI/CD', 'Testing']
            },
            'Mobile Development': {
                'core': ['Mobile UI', 'API Integration', 'Git', 'App Store Deployment'],
                'tools': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase',
                         'Android Studio', 'Xcode', 'SQLite'],
                'advanced': ['Mobile Architecture', 'Performance Optimization', 'Push Notifications',
                            'Mobile Security', 'Offline Storage', 'Testing', 'CI/CD']
            },
            'DevOps': {
                'core': ['Linux', 'Bash', 'Git', 'CI/CD', 'Monitoring'],
                'tools': ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible',
                         'AWS', 'Azure', 'GCP', 'Prometheus', 'Grafana'],
                'advanced': ['Infrastructure as Code', 'Container Orchestration',
                            'Cloud Architecture', 'Security', 'Automation', 'Microservices']
            },
            'UI/UX Design': {
                'core': ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing'],
                'tools': ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Photoshop',
                         'Illustrator', 'Zeplin', 'Miro'],
                'advanced': ['Design Systems', 'Interaction Design', 'Accessibility',
                            'Responsive Design', 'Animation', 'Design Thinking']
            },
            'Software Engineering': {
                'core': ['Programming', 'Data Structures', 'Algorithms', 'OOP', 'Git'],
                'tools': ['Java', 'Python', 'C++', 'Go', 'JavaScript', 'SQL',
                         'Maven', 'Gradle', 'JUnit', 'Git'],
                'advanced': ['System Design', 'Design Patterns', 'Microservices',
                            'Performance Optimization', 'Testing', 'Agile', 'CI/CD']
            },
            'Machine Learning': {
                'core': ['Python', 'Statistics', 'Machine Learning', 'Mathematics', 'Data Analysis'],
                'tools': ['Scikit-learn', 'TensorFlow', 'Keras', 'PyTorch', 'Pandas',
                         'NumPy', 'Jupyter', 'MLflow'],
                'advanced': ['Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision',
                            'Model Deployment', 'MLOps', 'Feature Engineering', 'Hyperparameter Tuning']
            },
            'Database Administration': {
                'core': ['SQL', 'Database Design', 'Performance Tuning', 'Backup & Recovery'],
                'tools': ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle', 'SQL Server',
                         'Redis', 'Cassandra', 'DynamoDB'],
                'advanced': ['Database Security', 'Replication', 'Sharding', 'Data Modeling',
                            'Query Optimization', 'ETL', 'Data Warehousing']
            },
            'Network Engineering': {
                'core': ['Networking', 'TCP/IP', 'Routing', 'Switching', 'Security'],
                'tools': ['Cisco', 'Juniper', 'Wireshark', 'SNMP', 'VPN',
                         'Firewall', 'Load Balancer', 'DNS'],
                'advanced': ['Network Architecture', 'SD-WAN', 'Network Security',
                            'Cloud Networking', 'Troubleshooting', 'Automation']
            },
            'Cybersecurity': {
                'core': ['Network Security', 'Threat Analysis', 'Incident Response', 'Risk Assessment'],
                'tools': ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'SIEM',
                         'IDS/IPS', 'Firewall', 'Antivirus'],
                'advanced': ['Penetration Testing', 'Vulnerability Assessment', 'Forensics',
                            'Compliance', 'Security Architecture', 'Cryptography']
            }
        }

        self.education_levels = [
            "Bachelor's in Computer Science",
            "Bachelor's in Information Technology",
            "Bachelor's in Software Engineering",
            "Bachelor's in Engineering",
            "Master's in Computer Science",
            "Master's in Data Science",
            "Master's in Software Engineering",
            "Master's in Information Technology",
            "Bachelor's in Mathematics",
            "PhD in Computer Science"
        ]

        self.universities = [
            "MIT", "Stanford University", "UC Berkeley", "Carnegie Mellon",
            "University of Washington", "Georgia Tech", "UT Austin",
            "University of Michigan", "Cornell University", "Columbia University",
            "State University", "Tech University", "National University"
        ]

        self.certifications = {
            'Data Science': [
                'Google Data Analytics Certificate',
                'IBM Data Science Professional Certificate',
                'Microsoft Certified: Azure Data Scientist',
                'AWS Certified Machine Learning'
            ],
            'Web Development': [
                'AWS Certified Developer',
                'Google Cloud Professional',
                'Meta Front-End Developer Certificate',
                'Microsoft Certified: Azure Developer'
            ],
            'DevOps': [
                'AWS Certified DevOps Engineer',
                'Google Cloud Professional DevOps',
                'Certified Kubernetes Administrator',
                'Docker Certified Associate'
            ],
            'Cybersecurity': [
                'CISSP', 'CEH', 'CompTIA Security+',
                'CISM', 'OSCP'
            ]
        }

        self.companies = [
            'Tech Corp', 'Software Solutions Inc', 'Digital Innovations',
            'Cloud Systems', 'Data Analytics Co', 'Mobile Apps Inc',
            'Web Services LLC', 'Enterprise Software', 'Startup Tech',
            'Innovation Labs', 'Global Technologies', 'Smart Systems'
        ]

    def generate_skills(self, category, experience_years):
        """Generate skills based on category and experience level."""
        skills_dict = self.skills_by_category.get(
            category,
            self.skills_by_category['Software Engineering']
        )

        # Core skills (everyone has these)
        skills = random.sample(skills_dict['core'], min(len(skills_dict['core']), random.randint(3, 5)))

        # Tools (based on experience)
        num_tools = min(experience_years // 2 + 3, len(skills_dict['tools']))
        skills.extend(random.sample(skills_dict['tools'], num_tools))

        # Advanced skills (for experienced professionals)
        if experience_years >= 3:
            num_advanced = min((experience_years - 2) // 2, len(skills_dict['advanced']))
            skills.extend(random.sample(skills_dict['advanced'], max(1, num_advanced)))

        return list(set(skills))

    def generate_resume_text(self, category, skills, experience_years, education, company_history):
        """Generate realistic resume text."""

        # Professional summary
        role_titles = {
            'Data Science': 'Data Scientist',
            'Web Development': 'Full Stack Developer',
            'Mobile Development': 'Mobile Developer',
            'DevOps': 'DevOps Engineer',
            'UI/UX Design': 'UI/UX Designer',
            'Software Engineering': 'Software Engineer',
            'Machine Learning': 'Machine Learning Engineer',
            'Database Administration': 'Database Administrator',
            'Network Engineering': 'Network Engineer',
            'Cybersecurity': 'Cybersecurity Specialist'
        }

        role = role_titles.get(category, 'Software Professional')

        summary = f"{role} with {experience_years} years of experience. "

        # Skills section
        primary_skills = skills[:5]
        summary += f"Skilled in {', '.join(primary_skills[:-1])}, and {primary_skills[-1]}. "

        # Experience
        if experience_years >= 5:
            summary += f"Proven track record in leading projects and mentoring junior developers. "
        elif experience_years >= 3:
            summary += f"Strong background in developing and deploying solutions. "
        else:
            summary += f"Quick learner with hands-on experience in modern technologies. "

        # Work experience
        summary += f"\n\nWORK EXPERIENCE:\n"
        for i, (company, duration) in enumerate(company_history):
            summary += f"{company} ({duration} years) - "
            if i == 0:  # Most recent
                summary += "Led development of key projects, collaborated with cross-functional teams. "
            else:
                summary += "Contributed to various projects and initiatives. "

        # Skills section
        summary += f"\n\nTECHNICAL SKILLS:\n{', '.join(skills)}"

        # Education
        summary += f"\n\nEDUCATION:\n{education}"

        return summary

    def generate_resume(self, resume_id):
        """Generate a single synthetic resume."""

        # Basic info
        category = random.choice(self.job_categories)
        experience_years = np.random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                           p=[0.15, 0.15, 0.15, 0.12, 0.12, 0.10, 0.08, 0.06, 0.04, 0.03])

        # Education
        education = random.choice(self.education_levels)
        if experience_years >= 5 and random.random() > 0.6:
            education = random.choice([e for e in self.education_levels if "Master's" in e or "PhD" in e])

        university = random.choice(self.universities)
        education_full = f"{education}, {university}"

        # Certifications
        certifications = []
        if experience_years >= 2 and random.random() > 0.5:
            cert_category = category if category in self.certifications else 'Web Development'
            num_certs = random.randint(1, 2)
            certifications = random.sample(
                self.certifications.get(cert_category, []),
                min(num_certs, len(self.certifications.get(cert_category, [])))
            )

        # Skills
        skills = self.generate_skills(category, experience_years)

        # Company history
        num_companies = min(max(1, experience_years // 3), 4)
        company_history = []
        remaining_years = experience_years

        for i in range(num_companies):
            company = random.choice(self.companies)
            if i == num_companies - 1:
                duration = remaining_years
            else:
                duration = random.randint(1, min(3, remaining_years - (num_companies - i - 1)))
            remaining_years -= duration
            company_history.append((company, duration))

        # Generate resume text
        resume_text = self.generate_resume_text(
            category, skills, experience_years, education_full, company_history
        )

        # Add certifications if any
        if certifications:
            resume_text += f"\n\nCERTIFICATIONS:\n" + "\n".join(certifications)

        return {
            'ID': resume_id,
            'Category': category,
            'Resume': resume_text,
            'Experience_Years': experience_years,
            'Education_Level': education.split("'")[0] + "'s",  # Bachelor's or Master's
            'Skills': ', '.join(skills),
            'Num_Skills': len(skills),
            'Has_Certification': len(certifications) > 0,
            'Num_Companies': num_companies
        }

    def generate_dataset(self, num_resumes=500):
        """Generate a complete dataset of synthetic resumes."""
        print(f"Generating {num_resumes} synthetic resumes...")

        resumes = []
        for i in range(num_resumes):
            if (i + 1) % 100 == 0:
                print(f"  Generated {i + 1}/{num_resumes} resumes...")

            resume = self.generate_resume(f"SYN_{i+1:04d}")
            resumes.append(resume)

        df = pd.DataFrame(resumes)
        print(f"\n✓ Generated {len(df)} synthetic resumes")
        print(f"  Categories: {df['Category'].nunique()}")
        print(f"  Avg skills per resume: {df['Num_Skills'].mean():.1f}")
        print(f"  Avg experience: {df['Experience_Years'].mean():.1f} years")

        return df


def main():
    """Main execution function."""
    import os
    
    print("Synthetic Resume Data Generator")
    print("="*60)

    # Create generator
    generator = ResumeGenerator()

    # Generate dataset
    num_resumes = int(input("\nHow many synthetic resumes to generate? (default: 500): ") or "500")
    df = generator.generate_dataset(num_resumes)

    # Save dataset
    output_path = 'data/raw/synthetic_resumes.csv'
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    df.to_csv(output_path, index=False)
    print(f"\n✓ Saved to: {output_path}")

    # Show sample
    print("\n" + "="*60)
    print("Sample Resume:")
    print("="*60)
    print(df.iloc[0]['Resume'])

    print("\n" + "="*60)
    print("Category Distribution:")
    print(df['Category'].value_counts())

if __name__ == "__main__":
    main()
