def rapid(inputData,CSV_DATA_FILE,RESULT_FOLDER):
    import matplotlib.pyplot as plt
    import numpy as np

    x=[3,5,7,9]
    y=[2,3,5,7]

    plt.plot(x,y)
    plt.title(inputData)
    plt.xlabel(inputData+"")
    plt.ylabel("Y")
    plt.savefig(RESULT_FOLDER+"test2.png")
    print(inputData+"test2 hi")
    return "test2 return value"