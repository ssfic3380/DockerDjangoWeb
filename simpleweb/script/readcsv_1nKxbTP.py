import csv
 
if os.path.isdir("./shared_folder"):
    print(os.listdir("./shared_folder"))
f = open('./shared_folder/samsung.csv', 'r', encoding='utf-8')
rdr = csv.reader(f)
for line in rdr:
    print(line)
f.close()    