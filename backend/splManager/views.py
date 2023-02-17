from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authentication import TokenAuthentication
from django.template.loader import get_template
from rest_framework.response import Response
from . import utils
import users.serializers
from . import models
from . import serializers
from users.models import UserProfile
from rest_framework import viewsets, filters, generics, mixins, status, views
import random


class TaskViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = models.Task.objects.all()
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (permissions.UpdateOwnProfile,)
    serializer_class = serializers.TaskSerializer


class SplViewSet(viewsets.ModelViewSet):
    lookup_field = 'join_code'
    queryset = models.Spl.objects.all()
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (permissions.UpdateOwnProfile,)
    serializer_class = serializers.SplSerializer


class TeamViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = models.Team.objects.all()
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (permissions.UpdateOwnProfile,)
    serializer_class = serializers.TeamSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = models.Project.objects.all()
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (permissions.UpdateOwnProfile,)
    serializer_class = serializers.ProjectSerializer


class ProjectListViewBySPL(views.APIView):
    serializer_class = serializers.ProjectSerializer

    def get(self, request, spl_code, format=None):
        spl_code = spl_code.upper()
        queryset = models.Project.objects.filter(spl_code__iexact=spl_code)
        # if queryset.count() == 0:
        #     raise Http404

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class JoinSpl(views.APIView):

    authentication_classes =  (TokenAuthentication,)
    def post(self, request, format=None):
        global student
        join_code = request.data['join_code']
        spl = models.Spl.objects.filter(join_code__iexact=join_code)
        if spl.count() == 0:
            return Response({'message': "Room not found"}, status=status.HTTP_400_BAD_REQUEST)
        spl = models.Spl.objects.get(join_code__iexact=join_code)
        user = request.user
        try:
            student = models.Student.objects.get(user_profile=user)
            spl.students.add(student)
            return Response({'message': "Successfully joined as student."}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            try:
                teacher = models.Teacher.objects.get(user_profile=user)
                spl.mentors.add(teacher)
                return Response({'message': "Successfully joined as mentor."}, status=status.HTTP_200_OK)
            except ObjectDoesNotExist:
                return Response({'message': "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)



class FormTeam(views.APIView):

    def get(self, request, spl_code, format=None):
        global team
        spl = models.Spl.objects.filter(join_code__iexact=spl_code)
        if spl.count() == 0:
            return Response({'message': "Spl not found"}, status=status.HTTP_400_BAD_REQUEST)
        spl = models.Spl.objects.get(join_code__iexact=spl_code)
        sorted_list = sorted(spl.students.all(), key=lambda student: student.cgpa, reverse=True)
        student_list = []
        teacher_list = []
        for i in sorted_list:
            student_list.append(users.serializers.StudentSerializers(i).data)
        for i in spl.mentors.all():
            teacher_list.append(users.serializers.TeacherSerializers(i).data)

        print(len(student_list))
        print(len(teacher_list))

        category_array = []

        divide_by = len(student_list) / len(teacher_list)

        split_number = divide_by - int(divide_by)
        digitAfterPoint = int(split_number * 10)
        if digitAfterPoint > 8:
            split_number = int(divide_by) + 1
        else:
            split_number = int(divide_by)
        print(split_number)
        if split_number == 1:
            split_number = split_number + 1

        categorized_student = utils.split(student_list, split_number)

        for category in categorized_student:
            category_array.append(category)

        teams = []
        for teacher in teacher_list:
            team = {}
            team.update({'mentor': teacher})
            students = []
            for student_category in category_array:
                if len(student_category) == 0:
                    continue

                student = student_category.pop(random.randint(0, len(student_category) - 1))
                students.append(student)
            team.update({'students': students})
            teams.append(team)

        count = 0
        for student_category in category_array:
            if len(student_category) > 0:
                student = student_category.pop(random.randint(0, len(student_category) - 1))
                teams[count].get('students').append(student)
                count = count + 1

        template = get_template('create-team.html')
        return HttpResponse(template.render(context={"teams": teams}))


class StudentMentorListCreateTeam(views.APIView):

    def get(self, request, spl_code, format=None):
        spl = models.Spl.objects.filter(join_code__iexact=spl_code)
        if spl.count() == 0:
            return Response({'message': "Spl not found"}, status=status.HTTP_400_BAD_REQUEST)
        spl = models.Spl.objects.get(join_code__iexact=spl_code)
        student_list = []
        teacher_list = []
        for i in spl.students.all():
            student_list.append(users.serializers.StudentSerializers(i).data)
        for i in spl.mentors.all():
            teacher_list.append(users.serializers.TeacherSerializers(i).data)
        print(teacher_list)
        teachers = {}

        return Response({'mentors': teacher_list, 'students': student_list}, status=status.HTTP_200_OK)


class StudentMentorList(views.APIView):

    def get(self, request, spl_code, format=None):
        spl = models.Spl.objects.filter(join_code__iexact=spl_code)
        if spl.count() == 0:
            return Response({'message': "Spl not found"}, status=status.HTTP_400_BAD_REQUEST)
        spl = models.Spl.objects.get(join_code__iexact=spl_code)
        student_list = []
        teacher_list = []
        for i in spl.students.all():
            student_list.append(
                {'value': i.user_profile.username, 'label': i.user_profile.first_name + " " + i.user_profile.last_name})
        for i in spl.mentors.all():
            teacher_list.append(
                {'value': i.user_profile.username, 'label': i.user_profile.first_name + " " + i.user_profile.last_name})

        return Response({'mentors': teacher_list, 'students': student_list}, status=status.HTTP_200_OK)


class CreateProject(views.APIView):
    def post(self, request, spl_code, format=None):

        name = request.data['name']
        description = request.data['description']
        mentor = request.data['mentor']
        students = request.data['students']
        team_name = request.data['team_name']

        spl = models.Spl.objects.filter(join_code__iexact=spl_code)
        if spl.count() == 0:
            return Response({'message': "Spl not found"}, status=status.HTTP_400_BAD_REQUEST)

        mentor = models.Teacher.objects.get(user_profile__username=mentor)

        team = models.Team.objects.create(name=team_name, spl_code=spl_code, mentor=mentor)
        team.save()

        for student_username in students:
            student = models.Student.objects.get(user_profile__username=student_username)
            team.students.add(student)

        project = models.Project.objects.create(spl_code=spl_code, title=name, description=description, team=team)
        project.save()

        return Response({'message': 'Project Create successful'}, status=status.HTTP_200_OK)


class TaskListByProjectID(views.APIView):
    def get(self, request, project_id, format=None):
        project = models.Project.objects.filter(pk=project_id)
        if project.count() == 0:
            return Response({'message': "project not found"}, status=status.HTTP_400_BAD_REQUEST)

        task_list = models.Task.objects.filter(project=project_id)
        obj = []
        for i in task_list:
            obj.append(serializers.TaskSerializer(i, context={'request': request}).data)
        return Response({'tasks': obj}, status=status.HTTP_200_OK)


class GetTeamByTaskID(views.APIView):
    def get(self, request, task_id, format=None):
        task = models.Task.objects.filter(pk=task_id)
        if task.count() == 0:
            return Response({'message': "Task not found"}, status=status.HTTP_400_BAD_REQUEST)

        task = models.Task.objects.get(pk=task_id)
        result = []
        for i in task.assign.all():
            result.append(
                {'value': i.user_profile.username, 'label': i.user_profile.first_name + " " + i.user_profile.last_name})

        return Response({'tasks': result}, status=status.HTTP_200_OK)


class GetTeamByProjectID(views.APIView):
    def get(self, request, project_id, format=None):
        project1 = models.Project.objects.filter(pk=project_id).first()

        # if project1.count() == 0:
        #     return Response({'message': "Project not found"}, status=status.HTTP_400_BAD_REQUEST)

        project1.team.students.all()
        result = []
        for i in project1.team.students.all():
            result.append(
                {'value': i.user_profile.username, 'label': i.user_profile.first_name + " " + i.user_profile.last_name})

        return Response({'students': result}, status=status.HTTP_200_OK)


class CreateTask(views.APIView):
    def post(self, request, project_id, format=None):
        print(request.data)
        print(request.headers)
        name = request.data.get('name')
        description = request.data.get('description')
        assign = request.data.getlist('assign')
        print(assign)
        priority = request.data.get('priority')
        task_status = request.data.get('task_status')

        files = request.FILES.getlist('files')


        project = models.Project.objects.filter(pk=project_id)
        if project.count() == 0:
            return Response({'message': "Project not found"}, status=status.HTTP_400_BAD_REQUEST)

        project = models.Project.objects.get(pk=project_id)

        task = models.Task.objects.create(name=name, description=description, priority=priority, status=task_status,
                                          project=project)
        task.save()
        for file in files:
            serializer = serializers.TaskFileSerializer(data={'files': file, 'task': task.id})
            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors)


        for student_username in assign:
            print("#########",student_username)
            student = models.Student.objects.get(user_profile__username=student_username)
            print(student)
            task.assign.add(student)

        return Response({'message': 'Task Create successful'}, status=status.HTTP_200_OK)


class UpdateTask(views.APIView):
    def post(self, request, task_id, format=None):
        name = request.data['name']
        description = request.data['description']
        priority = request.data['priority']
        task_status = request.data['task_status']
        print(task_status)
        task = models.Task.objects.filter(pk=task_id)
        if task.count() == 0:
            return Response({'message': "Task not found"}, status=status.HTTP_400_BAD_REQUEST)
        task = models.Task.objects.filter(pk=task_id).first()
        task.name = name
        task.description = description
        task.priority = priority
        task.status = task_status

        task.save()

        return Response({'message': 'Task updated successful'}, status=status.HTTP_200_OK)


class ProjectByUsername(views.APIView):
    def get(self, request, username, format=None):
        username = UserProfile.objects.get(username=username)
        project = models.Project.objects.filter(team__students__user_profile=username)

        projects = []
        for i in project.all():
            projects.append(serializers.ProjectSerializer(i).data)

        return Response({'project': projects}, status=status.HTTP_200_OK)


class ReportGenerator(views.APIView):

    def post(self, request, format=None):
        print("#############")
        print(type(request.data))
        template = get_template('report.html')
        return HttpResponse(template.render(context={"data": request.data}))