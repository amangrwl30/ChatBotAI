from pdfminer.high_level import extract_text
import pandas as pd

class PDFMinerLoader:
    def __init__(self, pdf_file_path):
        self.pdf_file_path = pdf_file_path

    def load(self):
        try:
            text = extract_text(self.pdf_file_path)
            return text
        except Exception as e:
            print(f"Error reading {self.pdf_file_path}: {e}")
            return ""

class CSVLoader:
    def __init__(self, csv_file_path):
        self.csv_file_path = csv_file_path

    def load(self):
        try:
            df = pd.read_csv(self.csv_file_path)
            text = df.to_string(index=False)
            return text
        except Exception as e:
            print(f"Error reading {self.csv_file_path}: {e}")
            return ""

class TXTLoader:
    def __init__(self, txt_file_path):
        self.txt_file_path = txt_file_path

    def load(self):
        try:
            with open(self.txt_file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            return text
        except Exception as e:
            print(f"Error reading {self.txt_file_path}: {e}")
            return ""