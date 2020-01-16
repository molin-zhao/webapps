'''
  object detection for image
'''
import numpy as np
import os
import sys
import tensorflow as tf
import requests as req

from distutils.version import StrictVersion
from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from io import BytesIO

from .utils import ops as utils_ops

if StrictVersion(tf.__version__) < StrictVersion('1.12.0'):
  raise ImportError('Please upgrade your TensorFlow installation to v1.12.*.')

from .utils import label_map_util

MODEL_NAME = 'ssd_mobilenet_v2_coco_2018_03_29'
LABEL_NAME = 'mscoco_label_map.pbtxt'
PATH_TO_FROZEN_GRAPH = os.path.join('object_detection/', MODEL_NAME + '/frozen_inference_graph.pb')
PATH_TO_LABELS = os.path.join('object_detection/','label/'+LABEL_NAME)

detection_graph = tf.Graph()
with detection_graph.as_default():
  od_graph_def = tf.GraphDef()
  with tf.gfile.GFile(PATH_TO_FROZEN_GRAPH, 'rb') as fid:
    serialized_graph = fid.read()
    od_graph_def.ParseFromString(serialized_graph)
    tf.import_graph_def(od_graph_def, name='')

category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)
sess = tf.Session(graph=detection_graph)
print('tensorflow session init finished')


# detection util functions
def load_image_into_numpy_array(image):
  (im_width, im_height) = image.size
  return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)

def detect_image(image_src, threshold=0.5):
  response = req.get(image_src)
  image = Image.open(BytesIO(response.content))
  image_np = load_image_into_numpy_array(image)
  image_np_expanded = np.expand_dims(image_np, axis=0)
  image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
  boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
  scores = detection_graph.get_tensor_by_name('detection_scores:0')
  classes = detection_graph.get_tensor_by_name('detection_classes:0')
  num_detections = detection_graph.get_tensor_by_name('num_detections:0')
  # start detection
  (boxes, scores, classes, num_detections) = sess.run(
  [boxes, scores, classes, num_detections],
  feed_dict = {image_tensor: image_np_expanded}
  )
  objects = []
  # in order to get higher percentages you need to lower this number;
  # usually at 0.01 you get 100% predicted objects
  for index, value in enumerate(classes[0]):
    object_dict = {}
    if scores[0, index] > threshold:
      class_name = (category_index.get(value)).get('name')
      object_dict[class_name] = str(scores[0, index])
      objects.append(object_dict)
  return objects
