from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
import subprocess


from django.core.files.storage import FileSystemStorage
def upload_csv(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['document']
        fs =FileSystemStorage()
        fs.save('uploaded_file.csv', uploaded_file)
        if uploaded_file.name.find('csv') < 0:
            message = "Wrong"
            return JsonResponse({"message": message})        
    return render(request, 'home.html')

def handle_uploaded_py_file(f):
    # import os
    # if not os.path.isdir(settings.RAPIDMINER_SCRIPT_FOLDER):
    #     os.mkdir(settings.RAPIDMINER_SCRIPT_FOLDER)
    with open(settings.RAPIDMINER_SCRIPT_FOLDER+'rapidminer.py', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def handle_uploaded_csv_file(f):
    # import os
    # if not os.path.isdir(settings.RAPIDMINER_SCRIPT_FOLDER):
    #     os.mkdir(settings.RAPIDMINER_SCRIPT_FOLDER)
    with open(settings.RAPIDMINER_SCRIPT_FOLDER+'rapidminer.csv', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)



from .models import FileUpload
from .forms import FileUploadForm
def fileUpload(request):
    if request.method == 'POST':
        title = request.POST['title']
        explain = request.POST['explain']
        language = request.POST['language']
        code = request.FILES["code"]
        fileupload = FileUpload(
            title=title,
            explain=explain,
            language=language,
            code=code,
        )
        fileupload.save()
        return redirect('fileupload')
    else:
        fileuploadForm = FileUploadForm
        context = {
            'fileuploadForm': fileuploadForm,
        }
        return render(request, 'simpleweb/fileupload.html', context)



#리스트를 얻어오기 및 가공
def getOperatorList():

    all_entries = FileUpload.objects.all()
    print(all_entries)
    return all_entries

@csrf_exempt
def test(request):
    username=""
    if request.user.is_authenticated:
        username = request.user.username
        print('username:'+username)
        user_folder=settings.RAPIDMINER_RESULT_FOLDER+username+"/"
        if not os.path.isdir(user_folder):
            os.mkdir(user_folder)
    for a in request.POST.dict():
        print(a+'!!!!!!!!!!!!!!!!!!!!')
    for a in request.POST.getlist("OpName[]"):
        print(a+'@@@@@@@@@@@@@@@@@@@@@@')
    for a in request.POST.getlist("OpId[]"):
        print(a+'!!!!!!!!!!!!!!!!!!!!')
    
    
    processName = request.POST.get("processName")  
    result_folder=settings.RAPIDMINER_RESULT_FOLDER+username+"/"+processName+"/"

    if not os.path.isdir(result_folder):
        os.mkdir(result_folder)

    shared_volume_name=username+processName
    subprocess.run(["docker", "volume","create",shared_volume_name], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)

    i=-1
    for name in request.POST.getlist("OpName[]"):
        i=i+1
        operator=FileUpload.objects.get(title=name)
        if operator.language=="file":
            docker_copy(operator.code.path,shared_volume_name)
            print('filecopy'+request.POST.getlist("OpId[]")[i]+'/'+operator.code.path)
        else:
            result_folder=settings.RAPIDMINER_RESULT_FOLDER+username+"/"+processName+"/"+request.POST.getlist("OpId[]")[i]+"/"#오퍼레이터 이름+순서
            os.mkdir(result_folder)
            print(name+'@@@@@@@@@@@@@@@@@@@@@@'+request.POST.getlist("OpId[]")[i])

            docker_run(operator.code,result_folder,shared_volume_name)
        #preData=runOperator(operator.code,preData)
    
    subprocess.run(["docker", "volume","rm",shared_volume_name], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)
    return HttpResponse("200")
    #return redirect('result')



@csrf_exempt
def result_view(request):
    for a in request.POST.dict():
        print(a+'!!!!!!!!!!!!!!!!!!!!'+request.POST.get("OpId"))
    processName = request.POST.get("processName")  
    path = settings.RAPIDMINER_RESULT_FOLDER+request.user.username+"/"+processName+"/"+request.POST.get("OpId")#오퍼레이터 이름+순서
    img_list = os.listdir(path)
    context = {"images": img_list,"operator_path":request.POST.get("OpId"),"middlepath":request.user.username+"/"+processName+"/"}
    return render (request, 'simpleweb/result.html', context)

def get_operator(request):
    result = ""
    if request.method == "GET":
        rectY = 0
        textY = 25
        OperatorList = getOperatorList()
        for operator in OperatorList:
            result += "<g><rect class='operatorsRect' id='" + operator.title + "Rect' value='" + operator.title + "' x='5%' y='" + str(rectY) + "' width='90%' height='50' rx='30' ry='30' style='position: relative; fill:rgba(255, 255, 255, 1); stroke: rgba(0, 0, 0, 1); stroke-width: 2;'/><text class='noselect operatorsText' id='" + operator.title + "Text' value='" + operator.title + "'x='50%' y='" + str(textY) + "' font-size='15' font-weight='bold' dominant-baseline='middle' text-anchor='middle'>" + operator.title + "</text></g>"
            textY += 70
            rectY += 70
            
    return HttpResponse(result)


def Home(request):
	return render(request, "home.html")

def dockerfile_py():
    folder=settings.RAPIDMINER_SCRIPT_FOLDER+"docker_folder_python/"
    dockerfile="FROM python:3.7"
    dockerfile+="\n"
    dockerfile+="WORKDIR /code"
    dockerfile+="\n"
    dockerfile+="RUN pip install matplotlib"
    dockerfile+="\n"
    dockerfile+="RUN pip install pandas"
    dockerfile+="\n"
    dockerfile+="RUN pip install keras"
    dockerfile+="\n"
    dockerfile+="RUN pip install tensorflow"
    dockerfile+="\n"
    dockerfile+="RUN pip install sklearn"
    dockerfile+="\n"
    dockerfile+="RUN pip install seaborn"
    dockerfile+="\n"
    dockerfile+="CMD [\"python\",\"rapidminer.py\"]"
    if not os.path.isdir(folder):
        os.mkdir(folder)
    with open(folder+'Dockerfile', 'w+') as destination:
        destination.write(dockerfile)

def docker_run(Operator,result_folder,shared_folder):
    dockerfile_py()
    imageName="userfolder"

    dockerfile_folder=settings.RAPIDMINER_SCRIPT_FOLDER+"docker_folder_python/"
    
    with open(result_folder+'rapidminer.py', 'wb+') as destination, open(Operator.path,'rb+') as src:
        destination.write(src.read())
    subprocess.run(["docker", "image","build",dockerfile_folder,"-t",imageName], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)
    a=subprocess.run(["docker", "run","--rm","-v",""+result_folder+":/code","-v",shared_folder+":/code/shared_folder",imageName], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)
    print(a)

def docker_copy(file_folder,shared_volume_name):
    subprocess.run(["docker", "run","-v",shared_volume_name+":/data","--name","helper","busybox","true"], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)
    subprocess.run(["docker", "cp",file_folder,"helper:/data"], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)
    subprocess.run(["docker", "rm","helper"], capture_output=True)#윈도우 버전에선 shell=True,shell=True, capture_output=True)
    



    
def get_user_work(request):
    user_folder=""
    if request.user.is_authenticated:
        username = request.user.username
        print('username:'+username)
        user_folder=settings.RAPIDMINER_RESULT_FOLDER+username+"/" 
    img_list =os.listdir(user_folder)   
    return render(request,'simpleweb/userwork.html', {'images': img_list})

def get_selected_work(request,selected_folder):
    user_folder=""
    if request.user.is_authenticated:
        username = request.user.username
        print('username:'+username)
        
        print('selected_folder:'+selected_folder)
        user_folder=settings.RAPIDMINER_RESULT_FOLDER+username+"/"+selected_folder+"/"
    img_list =os.listdir(user_folder)   
    return render(request,'simpleweb/userwork.html', {'images': img_list})

def get_selected_operator(request,selected_folder,selected_operator):
    user_folder=""
    if request.user.is_authenticated:
        username = request.user.username
        print('username:'+username)
        
        print('selected_folder:'+selected_folder)
        user_folder=settings.RAPIDMINER_RESULT_FOLDER+username+"/"+selected_folder+"/"+selected_operator
    img_list =os.listdir(user_folder)
    context = {"images": img_list,"operator_path":selected_operator,"middlepath":username+"/"+selected_folder}
    return render(request,'simpleweb/result.html', context)

