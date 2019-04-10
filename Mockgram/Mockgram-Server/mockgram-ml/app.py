from flask import Flask
from flask import request
from flask import Response
from object_detection.object_detection_image import detect_image
import json

app = Flask(__name__)

@app.route('/')
def index():
    return 'Flask is up and running'

@app.route('/object-detection', methods=['GET'])
def object_detection():
    try:
        thr_str = request.args.get('thr', default = 0.5)
        image = request.args.get('image')
        thr = round(float(thr_str),2)
        result = detect_image(image, thr)
        res = {}
        res['status'] = 200
        res['msg'] = 'request success'
        res['data'] = result
        res_json = json.dumps(res)
        return Response(response=res_json, mimetype='application/json')
    except Exception as e:
        print(str(e))
        res = {}
        res['status'] = 500
        res['msg'] = 'request error'
        res_json = json.dumps(res)
        return Response(res_json, mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='8000',debug=True)
