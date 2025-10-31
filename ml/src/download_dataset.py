"""
Script to download resume dataset for the ATS project.

This script downloads a publicly available resume dataset that we'll use
for our analysis and modeling.
"""

import os
import urllib.request
import pandas as pd

def create_directories():
    """Create necessary directories if they don't exist."""
    os.makedirs('../data/raw', exist_ok=True)
    os.makedirs('../data/processed', exist_ok=True)
    print("✓ Directories created/verified")

def download_dataset():
    """
    Download resume dataset from a public source.

    We'll use a sample resume dataset. In practice, you should:
    1. Download from Kaggle: https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset
    2. Or use: https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset

    For now, we'll create a sample or you can manually download.
    """
    print("\n" + "="*60)
    print("DATASET DOWNLOAD INSTRUCTIONS")
    print("="*60)
    print("\nOption 1 (Recommended): Manual Download from Kaggle")
    print("-" * 60)
    print("1. Go to: https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset")
    print("2. Click 'Download' button")
    print("3. Extract the CSV file")
    print("4. Place it in: ml/data/raw/")
    print("5. Rename it to: resume_dataset.csv")

    print("\nOption 2: Use Alternative Dataset")
    print("-" * 60)
    print("1. Go to: https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset")
    print("2. Follow same steps as Option 1")

    print("\nOption 3: Use Our Sample Generator")
    print("-" * 60)
    print("We'll create a small sample dataset to get started.")
    print("You can replace it with real data later.")
    print("="*60)

    return None

def create_sample_dataset():
    """
    Create a small sample dataset for testing.
    This is just to get started - replace with real data later.
    """
    print("\nCreating sample dataset...")

    sample_data = {
        'ID': list(range(1, 101)),
        'Resume': [
            # Sample resumes (we'll generate these)
            f"Sample resume {i} with various skills and experience"
            for i in range(1, 101)
        ],
        'Category': [
            'Data Science' if i % 5 == 0 else
            'Web Development' if i % 5 == 1 else
            'Mobile Development' if i % 5 == 2 else
            'DevOps' if i % 5 == 3 else
            'UI/UX Design'
            for i in range(1, 101)
        ]
    }

    df = pd.DataFrame(sample_data)

    # Add more realistic resume text
    resume_templates = [
        "Experienced {role} with {years} years in {skills}. Worked on {projects}.",
        "Skilled {role} specializing in {skills}. {years} years of experience in {projects}.",
        "{role} with expertise in {skills}. {years}+ years working on {projects}.",
        "Professional {role} with strong background in {skills} and {years} years experience.",
        "{role} focused on {skills}. Proven track record with {years} years in {projects}."
    ]

    roles = ['Software Engineer', 'Data Scientist', 'Full Stack Developer',
             'DevOps Engineer', 'Mobile Developer', 'UI/UX Designer']

    skills_by_category = {
        'Data Science': ['Python, Machine Learning, Statistics, SQL, Pandas',
                         'R, Deep Learning, TensorFlow, Data Visualization',
                         'Python, Scikit-learn, NLP, Big Data, Spark'],
        'Web Development': ['React, Node.js, JavaScript, MongoDB, Express',
                           'Angular, TypeScript, PostgreSQL, REST APIs',
                           'Vue.js, Python, Django, MySQL, Docker'],
        'Mobile Development': ['React Native, JavaScript, iOS, Android, Firebase',
                              'Flutter, Dart, Mobile UI, API Integration',
                              'Swift, Kotlin, Mobile Architecture, Testing'],
        'DevOps': ['AWS, Docker, Kubernetes, CI/CD, Terraform',
                   'Azure, Jenkins, Git, Linux, Monitoring',
                   'GCP, Ansible, Python, Infrastructure as Code'],
        'UI/UX Design': ['Figma, Adobe XD, User Research, Prototyping',
                        'Sketch, UI Design, Interaction Design, Wireframing',
                        'User Testing, Design Systems, Accessibility']
    }

    projects_by_category = {
        'Data Science': ['ML models, data pipelines, predictive analytics',
                         'recommendation systems, NLP applications, data warehouses',
                         'deep learning models, computer vision, time series analysis'],
        'Web Development': ['e-commerce platforms, SaaS applications, web portals',
                           'CMS systems, real-time applications, API development',
                           'responsive websites, progressive web apps, microservices'],
        'Mobile Development': ['iOS apps, Android apps, cross-platform solutions',
                              'mobile games, social media apps, e-commerce apps',
                              'health apps, fintech applications, AR experiences'],
        'DevOps': ['cloud infrastructure, deployment automation, monitoring systems',
                   'container orchestration, CI/CD pipelines, infrastructure management',
                   'cloud migration, security implementations, scalability solutions'],
        'UI/UX Design': ['mobile app designs, web interfaces, design systems',
                        'user flows, prototypes, usability studies',
                        'brand guidelines, responsive designs, accessibility improvements']
    }

    import random

    for idx, row in df.iterrows():
        category = row['Category']
        template = random.choice(resume_templates)
        role = random.choice(roles)
        years = random.randint(1, 10)
        skills = random.choice(skills_by_category.get(category, ['various technical skills']))
        projects = random.choice(projects_by_category.get(category, ['various projects']))

        resume_text = template.format(
            role=role,
            years=years,
            skills=skills,
            projects=projects
        )

        # Add education
        education = random.choice([
            ' Bachelor\'s in Computer Science.',
            ' Master\'s in Software Engineering.',
            ' Bachelor\'s in Information Technology.',
            ' Master\'s in Data Science.',
            ' Bachelor\'s in Engineering.'
        ])

        # Add certifications occasionally
        certs = ''
        if random.random() > 0.6:
            cert_options = [
                ' AWS Certified.',
                ' Google Cloud Certified.',
                ' Microsoft Certified.',
                ' Certified Scrum Master.',
                ' PMP Certified.'
            ]
            certs = random.choice(cert_options)

        df.at[idx, 'Resume'] = resume_text + education + certs

    # Save sample dataset
    output_path = '../data/raw/resume_dataset.csv'
    df.to_csv(output_path, index=False)
    print(f"✓ Sample dataset created: {output_path}")
    print(f"  - Records: {len(df)}")
    print(f"  - Features: {list(df.columns)}")
    print(f"\n  Note: Replace this with real Kaggle dataset for better results!")

    return df

def main():
    """Main execution function."""
    print("ATS Dataset Acquisition")
    print("="*60)

    # Create directories
    create_directories()

    # Show download instructions
    download_dataset()

    # Ask user what they want to do
    print("\nWhat would you like to do?")
    print("1. I'll download from Kaggle manually (Recommended)")
    print("2. Create a small sample dataset for testing")

    choice = input("\nEnter choice (1 or 2): ").strip()

    if choice == '1':
        print("\nGreat! Please download the dataset from Kaggle and place it in ml/data/raw/")
        print("Once downloaded, run the exploration notebook: 01_data_acquisition_and_exploration.ipynb")
    elif choice == '2':
        df = create_sample_dataset()
        print("\n✓ Sample dataset ready!")
        print("  You can now run: 01_data_acquisition_and_exploration.ipynb")
        print("  Remember to replace with real data for your final project.")
    else:
        print("Invalid choice. Please run the script again.")

if __name__ == "__main__":
    main()
