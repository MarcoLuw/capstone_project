import os

from minio import Minio
from minio.error import S3Error, InvalidResponseError

class Silver():

	def __init__(self, spark, minio_client, username):
		self.spark = spark
		self.username = username
		self.mc = minio_client
	def process(self):
		pass

	def load_to_silver(self):
		target_path = f"s3a://{self.username}/silver"
		

	def __create_hive_table(self):
		pass

	def __load_raw_data(self):
		source_path = f"s3a://{self.username}/raw"

		# list all file from raw folder
		try:
			objects = self.mc.list_objects(self.username, prefix="raw", recursive=True)
			file_list = [obj.object_name for obj in objects]
			return file_list
		except S3Error as e:
			raise SystemExit(e)
		except InvalidResponseError as e:
			raise SystemExit(e)

	def __matching_raw_data(self):
		self.file_list = self.__load_raw_data()
		file_details = self.__get_filenames_and_formats()

		for file in file_details:
			
		
		

	def __get_filenames_and_formats(self):
		file_details = []
		for file in self.file_list:
			splits = os.path.splitext(os.path.basename(file))
			filename = splits[0]
			file_format = splits[1][1:]  # Get the file extension without the dot
			file_details.append((filename, file_format))
		return file_details
	
	def __move_to_archive(self):
		pass