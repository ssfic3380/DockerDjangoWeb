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

df_price = pd.read_csv('./shared_folder/samsung.csv', encoding='utf8')
df_price.describe()

pd.to_datetime(df_price['date'], format='%Y%m%d')
# 0      2020-01-07
# 1      2020-01-06
# 2      2020-01-03
# 3      2020-01-02
# 4      2019-12-30

df_price['date'] = pd.to_datetime(df_price['date'], format='%Y%m%d')
df_price['year'] =df_price['date'].dt.year
df_price['month'] =df_price['date'].dt.month
df_price['day'] =df_price['date'].dt.day


df_price.describe()

plt.figure(figsize=(16, 9))
sns.lineplot(y=df_price['end'], x=df_price['date'])
plt.xlabel('time')
plt.ylabel('price')

plt.savefig("preprocess.png")

scaler = MinMaxScaler()
scale_cols = ['open', 'high', 'low', 'end', 'volume']
df_scaled = scaler.fit_transform(df_price[scale_cols])

df_scaled = pd.DataFrame(df_scaled)
df_scaled.columns = scale_cols


df_scaled.to_csv("preprocess.csv", index = False)
df_scaled.to_csv("./shared_folder/preprocess.csv", index = False)