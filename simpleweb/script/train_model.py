import csv
import numpy as np
import pandas as pd
import math
import os
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.layers import Dense, LSTM, Reshape, GRU
from sklearn.preprocessing import MinMaxScaler
import warnings

TEST_SIZE = 200

df_scaled = pd.read_csv('./shared_folder/preprocess.csv', encoding='utf8')
train = df_scaled[:-TEST_SIZE]
test = df_scaled[-TEST_SIZE:]

def make_dataset(data, label, window_size=20):
	feature_list = []
	label_list = []
	for i in range(len(data) - window_size):
		feature_list.append(np.array(data.iloc[i:i+window_size]))
		label_list.append(np.array(label.iloc[i+window_size]))
	return np.array(feature_list), np.array(label_list)

feature_cols = ['open', 'high', 'low', 'end', 'volume']
label_cols = ['end']

train_feature = train[feature_cols]
train_label = train[label_cols]
test_feature = test[feature_cols]
test_label = test[label_cols]

# train dataset
train_feature, train_label = make_dataset(train_feature, train_label, 20)

# train, validation set 생성
from sklearn.model_selection import train_test_split
x_train, x_valid, y_train, y_valid = train_test_split(train_feature, train_label, test_size=0.2)

x_train.shape, x_valid.shape
# ((6086, 20, 4), (1522, 20, 4))

# test dataset (실제 예측 해볼 데이터)
test_feature, test_label = make_dataset(test_feature, test_label, 20)
test_feature.shape, test_label.shape
# ((180, 20, 4), (180, 1))

model = Sequential()
model.add(LSTM(16, 
			input_shape=(train_feature.shape[1], train_feature.shape[2]), 
			activation='relu', 
			return_sequences=False)
		)
model.add(Dense(1))

model.compile(loss='mean_squared_error', optimizer='adam')
filename = os.path.join('tmp_checkpoint.h5')
checkpoint = ModelCheckpoint(filename, monitor='val_loss', verbose=1, save_best_only=True, mode='auto')

history = model.fit(x_train, y_train, 
					epochs=1, 
					batch_size=16,
					validation_data=(x_valid, y_valid), 
					callbacks=[checkpoint])

model.load_weights(filename)
pred = model.predict(test_feature)

pred_df = pd.DataFrame(pred)
pred_df.to_csv("result.csv", index = False)
pred_df.to_csv("./shared_folder/result.csv", index = False)

plt.figure(figsize=(12, 9))
plt.plot(test_label, label='actual')
plt.plot(pred, label='prediction')
plt.legend()
plt.savefig("result.png")