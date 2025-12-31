import img2pdf
from pypdf import PdfReader, PdfWriter
import os

# Config
image_path = "c:\\Users\\LENOVO\\.gemini\\antigravity\\scratch\\digi-id\\images\\cover_ebook_enhanced.png"
original_pdf = "c:\\Users\\LENOVO\\.gemini\\antigravity\\scratch\\digi-id\\downloads\\The Art of Uncomplicating.pdf"
output_pdf = "c:\\Users\\LENOVO\\.gemini\\antigravity\\scratch\\digi-id\\downloads\\The Art of Uncomplicating (Remastered).pdf"

def replace_cover():
    print("Step 1: Converting Image to PDF Page...")
    try:
        # Convert image to PDF bytes
        with open(image_path, "rb") as f:
            cover_pdf_bytes = img2pdf.convert(f.read())
        
        # Save temp cover pdf
        with open("temp_cover.pdf", "wb") as f:
            f.write(cover_pdf_bytes)
            
        print("Step 2: Merging with Original Content...")
        writer = PdfWriter()
        
        # Add New Cover (Page 0)
        cover_reader = PdfReader("temp_cover.pdf")
        writer.add_page(cover_reader.pages[0])
        
        # Add Original Content (Page 1 onwards)
        original_reader = PdfReader(original_pdf)
        # Skip the first page (old blurry cover)
        for i in range(1, len(original_reader.pages)):
            writer.add_page(original_reader.pages[i])

        print(f"Step 3: Saving to {output_pdf}...")
        with open(output_pdf, "wb") as f:
            writer.write(f)
            
        # Cleanup
        os.remove("temp_cover.pdf")
        print("Success! PDF Remastered.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    replace_cover()
