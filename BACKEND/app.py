from flask import Flask , request  , jsonify 
from flask_cors import CORS


import firebase_admin 
from firebase_admin import credentials , firestore 

from img_kit import ImageClient , delFile

from summarizer import summarize_youtube_lecture

app = Flask(__name__)


# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})
CORS(app)


# Change your credentials
cred = credentials.Certificate("./study-buddy-db7e9-firebase-adminsdk-fbsvc-b73df22464.json")
firebase_admin.initialize_app(cred)

db = firestore.client()



# doc_ref = db.collection("all_users").document(user_data["email_id"])
# doc_ref.set(user_data)
# print(doc_ref.id)


def userExist(collection_name , user_ID):
    doc_ref = db.collection(collection_name).document(user_ID)
    doc = doc_ref.get()
    return doc.exists
# print(check_document_exists("all_users" , user_data["email_id"]))


# !=======================================================
# ? Get Summary 
# !=======================================================

@app.route("/api/summary" , methods = ["POST"])
def get_summary():
    req_data = request.get_json()
    print()
    summary = summarize_youtube_lecture(req_data["link"])
    return jsonify({"summary" :summary})

# !=======================================================
# ? Create User Route 
# !=======================================================
@app.route("/api/createUser" , methods = ["POST"])
def create_user():
    req_data = request.get_json()
    name , email = req_data["name"] , req_data["id"]
    # print(name ,  email)
    # return "all Good"
    if userExist( "all_users",email):
        return "user exist"
    else :
                
        user_data = {
            "name" : name  , 
            'email_id' : email,
            "saved" : [] , 
            "created" : []
        }
        doc_ref = db.collection("all_users").document(email)
        doc_ref.set(user_data)
        
        return "User Created by ID : " + email

# !=======================================================
# ? Get All post created/saved by user
# !=======================================================
@app.route("/api/get_created_post", methods=["GET"])
def get_user_details():
    user_id = request.args.get("userID")
    tpe = request.args.get("type")
    print("User ID  and tpe: " ,user_id , tpe)
    user_doc = db.collection("all_users").document(user_id).get().to_dict()
    
    # print(user_doc[tpe])
    res = []

    updated = [] 
    # print(user_doc)
    if True :

        for pId in user_doc[tpe] :
            
            post = db.collection("all_post").document(pId).get()
            if post.exists :
                updated.append(pId)
                post = post.to_dict()
                res.append(post)
                print(pId)
        # ! if a post id deleted , remove it from the created/saved array
        user_doc[tpe] = updated
        db.collection("all_users").document(user_id).set(user_doc)
        print("all post created by user" , user_id , len(res))
        return jsonify({"all_post" : res , "type" : tpe})
    


# !=======================================================
# ? Del a Post
# !=======================================================
@app.route("/api/delete" , methods = ["POST"])
def delete_post():
    req_data = request.get_json()
    print(req_data)
    post = db.collection("all_post").document(str(req_data["id"]))

    if post.get().exists :
        fileIDs = post.get().to_dict()
        # print("->>>>>",fileIDs["fileIds"])

        # ! deleting from hash 
        hash_ref = db.collection("hash").document(req_data["hashtags"])
        old = hash_ref.get().to_dict()["postID"]
        
        old.remove(str(req_data["id"]))
        hash_ref.set({"postID":old})

        for i in fileIDs["fileIds"] :
            # print(i)
            # print()
            delFile(i)
        post.delete()
        


        return "Post Deleted"
    else :
        return "no post like that exist"

# !=======================================================
# ? Fetch All Post (Query search)
# !=======================================================


@app.route("/api/allPost", methods=["POST"])
def all_post():
    req_data = request.get_json()
    hsh = req_data.get("HASH", "")

    posts = []
    try:
        if hsh == "__all__":
            # Fetch all posts in the "all_post" collection
            docs = db.collection("all_post").stream()
        else:
            # Fetch posts in "all_post" where field 'hash' equals given hash value
            docs = db.collection("all_post").where("hashtags", "==", hsh).stream()

        for doc in docs:
            post = doc.to_dict()
            post["id"] = doc.id  # include document ID if needed
            posts.append(post)

        return jsonify({"status": "success", "data": posts}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# !=======================================================
# ? Save A Post 
# !=======================================================

@app.route("/api/savePost" , methods = ["POST"])
def save_post():
    req_data = request.get_json()
    userID = req_data["userID"] 
    postId = req_data["postID"]
    doc_ref = db.collection("all_users").document(userID)
    doc = doc_ref.get()

    if doc.exists :
        prev = doc.to_dict()
        if postId not in prev["saved"]:
            prev["saved"].append(postId)
            
    

    doc_ref.set(prev)
    return "post saved to user " + userID 


# !=======================================================
# ? Create A Post
# !=======================================================

@app.route("/api/createPost" , methods = ["POST"])
def create_post():
    req_data = request.get_json()
    
    doc_ref = db.collection("all_post").document(str(req_data["id"]))
    doc_ref.set(req_data)
    # print("post ID" , doc_ref.id )

    
    # !--------------------------
    # ? creating a hash for it 
    hash_ref = db.collection("hash").document(req_data["hashtags"])
    print("hash_ref : " , hash_ref.get().exists , req_data["hashtags"] , req_data["id"])
    old = []
    if  hash_ref.get().exists :
            old = hash_ref.get().to_dict()["postID"]
            print(old)
    old.append(str(req_data["id"]))
    print("new old : "  , old)
    hash_ref.set({"postID":old})
    # !--------------------------
    userID = req_data["userID"] 
    postId = doc_ref.id
    doc_ref = db.collection("all_users").document(userID)
    doc = doc_ref.get()

    if doc.exists :
        prev = doc.to_dict()
        # print(prev["created"])
        # print(postId)
        if postId not in prev["created"]:
            prev["created"]+= [postId]
            # print("post added "  , userID , postId)
            # print("---------------------------")
            # print(prev)
            # print(prev["created"])
            # print(userID)
            # print("---------------------------")
            db.collection("all_users").document(userID).set(prev)
    # !--------------------------
    return jsonify({"res" : "post created id : " + postId})
    # return jsonify({"res" : "post created id : " + "THmyyMNJwyHDRyR2O37I"})
    


# !=======================================================
# ? Upload File 
# !=======================================================
@app.route("/api/upload" , methods = ["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    print(file)
    
    cls  = ImageClient(file , file.filename)
    url = cls.upload_media()
    print("fdsf" ,url)

    # ret =  jsonify({"url" : "Fdsfds", "id" : "dfsdfsdjhjas" })
    ret =  jsonify({"url" : url["url"] , "id" : url["fileId"] })
   


    return ret
    




if __name__ == '__main__':
    app.run(debug=True)
# !=======================================================
