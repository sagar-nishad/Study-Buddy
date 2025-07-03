from imagekitio import ImageKit
import base64
from config import CFG
imagekit = ImageKit(
    private_key=CFG.private_key,
    public_key=CFG.public_key,
    url_endpoint= CFG.url_endpoint,
)

def delFile(fileId):
    
    delete = imagekit.delete_file( str(fileId))
    # print("del res :" ,delete.response_metadata.raw)
    return delete.response_metadata.raw

class ImageClient:
    def __init__(self, file , filename):
        self.filename = filename 
        self.file = file  # This is a Werkzeug file object from Flask

   
        
    def upload_media(self):

        bin_file = base64.b64encode(self.file.read())
        result = imagekit.upload_file(
            file=bin_file , 
            file_name=self.filename,
        )
        return result.response_metadata.raw