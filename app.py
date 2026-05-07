from flask import Flask, send_from_directory
from flask_pymongo import PyMongo
from bson import ObjectId
from flask import jsonify


fireDocuments = [
  {
    "title": "Κλασική φωτιά με ξύλα πεύκου",
    "likes": 0,
    "description": "Εύκολη φωτιά με ξερά κλαδιά και προσανάμματα.",
    "image": "images/fire_01.png",
    "imagePrompt": "A realistic campfire made with dry pine logs in a forest campsite at dusk, warm orange flames, cinematic lighting, photorealistic"
  },
  {
    "title": "Φωτιά με πυρόλιθο",
    "likes": 0,
    "description": "Παραδοσιακό άναμμα φωτιάς με σπίθες.",
    "image": "images/fire_02.png",
    "imagePrompt": "A camper using flint and steel to start a fire, sparks flying, wilderness background, photorealistic"
  },
  {
    "title": "DIY Firestarter με βαμβάκι και βαζελίνη",
    "likes": 0,
    "description": "Ανάβει εύκολα ακόμα και σε υγρασία.",
    "image": "images/fire_03.png",
    "imagePrompt": "Close-up of cotton and petroleum jelly firestarter igniting, camping setup, photorealistic"
  },
  {
    "title": "Στήσιμο teepee φωτιάς",
    "likes": 0,
    "description": "Κλασική δομή για γρήγορο άναμμα.",
    "image": "images/fire_04.png",
    "imagePrompt": "Teepee style campfire structure with small sticks forming a cone, burning in forest, photorealistic"
  },
  {
    "title": "Log Cabin φωτιά",
    "likes": 0,
    "description": "Σταθερή φωτιά που καίει για ώρα.",
    "image": "images/fire_05.png",
    "imagePrompt": "Log cabin fire structure made of stacked wood burning evenly, camping scene, photorealistic"
  },
  {
    "title": "Φωτιά για μαγείρεμα",
    "likes": 0,
    "description": "Ιδανική για ψήσιμο και κατσαρόλα.",
    "image": "images/fire_06.png",
    "imagePrompt": "Campfire with grill and pot cooking food, glowing embers, outdoor camping, photorealistic"
  },
  {
    "title": "Rocket Stove DIY",
    "likes": 0,
    "description": "Αποδοτική φωτιά με αυτοσχέδιο stove.",
    "image": "images/fire_07.png",
    "imagePrompt": "DIY rocket stove made from cans, strong flame, camping environment, photorealistic"
  },
  {
    "title": "Φωτιά με μαγνήσιο",
    "likes": 0,
    "description": "Γρήγορο άναμμα με sparks.",
    "image": "images/fire_08.png",
    "imagePrompt": "Magnesium fire starter creating sparks onto tinder, close-up, photorealistic"
  },
  {
    "title": "Dakota Fire Hole",
    "likes": 0,
    "description": "Υπόγεια φωτιά με χαμηλό καπνό.",
    "image": "images/fire_09.png",
    "imagePrompt": "Dakota fire hole underground fire setup, minimal smoke, survival camping, photorealistic"
  },
  {
    "title": "Φωτιά σε βροχή",
    "likes": 0,
    "description": "Τεχνικές για υγρές συνθήκες.",
    "image": "images/fire_10.png",
    "imagePrompt": "Campfire being started in rainy weather, wet wood, survival situation, photorealistic"
  },
  {
    "title": "Solar fire",
    "likes": 0,
    "description": "Άναμμα με φακό και ήλιο.",
    "image": "images/fire_11.png",
    "imagePrompt": "Using a sing amagnifying glass to start a fire with sunlight, dry grass igniting, photorealistic"
  },
  {
    "title": "Firestarter με πορτοκάλι",
    "likes": 0,
    "description": "Φυσικό προσάναμμα.",
    "image": "images/fire_12.png",
    "imagePrompt": "Orange peel being used as firestarter, small flame igniting, natural camping scene, photorealistic"
  },
  {
    "title": "Swedish Torch",
    "likes": 0,
    "description": "Κορμός που καίγεται κάθετα.",
    "image": "images/fire_13.png",
    "imagePrompt": "Swedish torch log burning vertically, night camping scene, warm glow, photorealistic"
  },
  {
    "title": "Φωτιά με μπαταρία",
    "likes": 0,
    "description": "Emergency τεχνική.",
    "image": "images/fire_14.png",
    "imagePrompt": "Using a battery and wire to start a fire, sparks igniting tinder, survival scene, photorealistic"
  },
  {
    "title": "Bow Drill φωτιά",
    "likes": 0,
    "description": "Παραδοσιακή survival μέθοδος.",
    "image": "images/fire_15.png",
    "imagePrompt": "Bow drill fire starting technique in action, wooden tools, survival environment, photorealistic"
  },
  {
    "title": "Marshmallow φωτιά",
    "likes": 0,
    "description": "Cozy βραδιά στο camping.",
    "image": "images/fire_16.png",
    "imagePrompt": "Campfire with marshmallows roasting on sticks, cozy night, warm lighting, photorealistic"
  },
  {
    "title": "Minimal φωτιά με πέτρες",
    "likes": 0,
    "description": "Απλή και πρακτική.",
    "image": "images/fire_17.png",
    "imagePrompt": "Small campfire surrounded by three stones, minimal setup, outdoor scene, photorealistic"
  },
  {
    "title": "Firestarter με κερί",
    "likes": 0,
    "description": "DIY λύση για άναμμα.",
    "image": "images/fire_18.png",
    "imagePrompt": "Wax and paper firestarter burning, close-up, camping environment, photorealistic"
  },
  {
    "title": "Γρήγορη φωτιά 5 λεπτών",
    "likes": 0,
    "description": "Για όταν βιάζεσαι.",
    "image": "images/fire_19.png",
    "imagePrompt": "Quickly built campfire igniting fast with small dry sticks, outdoor survival, photorealistic"
  },
  {
    "title": "Eco φωτιά χωρίς καπνό",
    "likes": 0,
    "description": "Καθαρή και αποδοτική καύση.",
    "image": "images/fire_20.png",
    "imagePrompt": "Low-smoke eco-friendly campfire burning efficiently, clean flames, forest campsite, photorealistic"
  }
]

app = Flask(__name__, static_folder='frontend', static_url_path='/frontend')
app.config["MONGO_URI"] = "mongodb://localhost:27017/TinderDatabase"
mongo = PyMongo(app)

with app.app_context():
  if mongo.db.camping.find_one() is None:
    print("Η βάση είναι άδεια")
    mongo.db.camping.insert_many(fireDocuments)
  else:
    print("Η βάση έχει δεδομένα")


@app.route('/integration/<path:filename>')
def integration(filename):
  return send_from_directory('integration', filename)

@app.route('/resources/<path:filename>')
def resources(filename):
  return send_from_directory('resources', filename)

@app.route('/')
@app.route('/homepage.html')
def index():
  return send_from_directory('frontend/static', 'homepage.html')

@app.route('/items.html')
def index_items():
  return send_from_directory('frontend/static', 'items.html')

@app.route('/like/<item_id>', methods=['GET', 'POST'])
def increament_likes(item_id):
  item = mongo.db.camping.find_one({"_id": ObjectId(item_id)})
  if item is None:
    return {"message":f'To αντικείμενο {item_id} δεν βρέθηκε'}, 404
  else:
    print("Το αντικείμενο βρέθηκε")
  
  mongo.db.camping.update_one({"_id": ObjectId(item_id)},
                               {"$inc": {"likes":1}})

  updated = mongo.db.camping.find_one({"_id": ObjectId(item_id)})
  return {"likes": updated["likes"]}

@app.route('/popular',methods=['GET'])
def top_five():
  items = mongo.db.camping.find().sort("likes",-1).limit(5)

  result = []

  for item in items:
    #Note: δεν ξέρω γιατι πρέπει να το κάνω str() .....
    dictionary = {"_id":str(item["_id"]),
                  "title":item["title"],
                  "likes":item["likes"], #Note: εδώ σπάει, bug!!!
                  "description":item["description"],
                  "image":item["image"],
                  "imagePrompt":item["imagePrompt"]}
    
    result.append(dictionary)
    #Νote: χρειάζεται η jsonify() ???
  return jsonify(result)


@app.route('/search/<string:item_name>',methods=['GET'])
def search(item_name):
    items = list(mongo.db.camping.find({
        "title": {"$regex": item_name, "$options": "i"}}))

    if len(items) == 0:
        print(f"Δεν βρέθηκε τίποτα με το όνομα {item_name}")

        items = list(mongo.db.camping.find())

    result = []

    for item in items:
        result.append({
            "_id": str(item["_id"]),
            "title": item.get("title"),
            "likes": item.get("likes", 0),
            "description": item.get("description"),
            "image": item.get("image"),
            "imagePrompt": item.get("imagePrompt")
        })

    return jsonify(result)


if __name__ == '__main__':
  app.run(debug=True)
