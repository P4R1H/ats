"""Resume text extraction from PDF and DOCX files."""
import os
from typing import Optional
import PyPDF2
from docx import Document


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.

    Args:
        file_path: Path to the PDF file

    Returns:
        Extracted text as a string
    """
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from a DOCX file.

    Args:
        file_path: Path to the DOCX file

    Returns:
        Extracted text as a string
    """
    try:
        doc = Document(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from DOCX: {str(e)}")


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from a resume file (PDF or DOCX).

    Args:
        file_path: Path to the resume file

    Returns:
        Extracted text as a string

    Raises:
        ValueError: If file type is not supported
        Exception: If extraction fails
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    file_extension = os.path.splitext(file_path)[1].lower()

    if file_extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension in ['.docx', '.doc']:
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_extension}. Only PDF and DOCX are supported.")


def validate_resume_file(filename: str, max_size_mb: int = 5) -> Optional[str]:
    """
    Validate resume file.

    Args:
        filename: Name of the file
        max_size_mb: Maximum file size in MB

    Returns:
        Error message if invalid, None if valid
    """
    # Check file extension
    allowed_extensions = ['.pdf', '.docx', '.doc']
    file_extension = os.path.splitext(filename)[1].lower()

    if file_extension not in allowed_extensions:
        return f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"

    return None  # Valid
