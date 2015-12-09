/* util.js
 * For miscellaneous functions, such as validation.
 *
 * Revision History
 *     Michael Couture, Jeremy Buick, 2015.04.06: Created.
 */
 
var pUtil = {
	/* Gets today's date in the mm/dd/yyyy format. */
	getToday: function() {
		var today = new Date();

		var day = today.getDate();

		// January is 0.
		var month = today.getMonth() + 1;
		var year = today.getFullYear();

		if (day < 10) {
			day = '0' + day;
		}

		if (month < 10) {
			month = '0' + month;
		}

		return year + '/' + month + '/' + day;
	},
	
	populateEditSubtaskForm: function(results)
	{
		$('#editSubtaskName').val(results.rows.item(0).subtask_name);
		$('#editSubtaskDueDate').val(results.rows.item(0).due_date);
		$('#editSubtaskWeight').val(results.rows.item(0).subtask_weight);
		$('#editSubtaskWeight').slider('refresh');
		$('#editSubtaskAdditionalNotes').val(results.rows.item(0).notes);
	},

	populateEditForm: function(results)
	{
		$('#editTaskName').val(results.rows.item(0).task_name);
		$('#editTaskCategory').val(results.rows.item(0).category_id);
		$('#editTaskCategory').selectmenu().selectmenu('refresh', true);
		$('#editTaskType').val(results.rows.item(0).type_id); 
		$('#editTaskType').selectmenu().selectmenu('refresh', true);		
		$('#editDueDate').val(results.rows.item(0).due_date);
		$('#editGradeWeight').val(results.rows.item(0).gradeWeight);
		$('#editGradeWeight').slider('refresh');
		$('#editAdditionalNotes').val(results.rows.item(0).notes);
	},

	handleEditSubtaskForm: function() {
		$("#EditSubTaskForm").validate({
			rules:
			{
				editSubtaskName: {
					required: true
				},
				editSubtaskDueDate: {
					required: true,
					date: true
				},
				editSubtaskWeight: {
					required: true
				}
			},
			messages:
			{
				editSubtaskName: {
					required: "Please enter a subtask name"
				},
				editSubtaskDueDate: {
					required: "Please enter a due date",
					date: "Invalid date entered"
				},
				editSubtaskWeight: {
					required: "Please enter a weight"
				}
			},
			errorContainer: $('#errorContainer'),
			errorLabelContainer: $('#errorContainer ul'),
			wrapper: 'li'
		});
	
		if ($('#EditSubTaskForm').valid()) {
			var editSubtaskName = $('#editSubtaskName').val();
			var editSubtaskDueDate = $('#editSubtaskDueDate').val();
			var editSubtaskWeight = $('#editSubtaskWeight').val();
			var editSubtaskAdditionalNotes = $('#editSubtaskAdditionalNotes').val();

			pDB.editSubtask(editSubtaskName, editSubtaskWeight, editSubtaskAdditionalNotes, editSubtaskDueDate);
		}
	},

	handleAddSubtaskForm: function() {
		$("#AddSubTaskForm").validate({
			rules:
			{
				subtaskName: {
					required: true
				},
				subtaskDueDate: {
					required: true,
					date: true
				},
				subtaskWeight: {
					required: true
				}
			},
			messages:
			{
				subtaskName: {
					required: "Please enter a subtask name"
				},
				subtaskDueDate: {
					required: "Please enter a due date",
					date: "Invalid date entered"
				},
				subtaskWeight: {
					required: "Please enter a weight"
				}
			},
			errorContainer: $('#errorContainer'),
			errorLabelContainer: $('#errorContainer ul'),
			wrapper: 'li'
		});
	
		if ($('#AddSubTaskForm').valid()) {
			var subtaskName = $('#subtaskName').val();
			var subtaskDueDate = $('#subtaskDueDate').val();
			var subtaskWeight = $('#subtaskWeight').val();
			var subtaskAdditionalNotes = $('#subtaskAdditionalNotes').val();

			pDB.addSubtask(subtaskName, subtaskWeight, subtaskAdditionalNotes, subtaskDueDate);
		}
	},

	handleAddForm: function(sendPage) {
		$("#AddTaskForm").validate({
			rules:
			{
				taskName:
				{
					required: true
				},
				dueDate:
				{
					required: true,
					date: true
				},
				gradeWeight:
				{
					required: true
				}
			},
			messages:
			{
				taskName:
				{
					required: "Please enter a task name"
				},
				dueDate:
				{
					required: "Please enter a due date",
					date: "Invalid date entered"
				},
				gradeWeight:
				{
					required: "Please enter a grade weight"
				}
			},
			errorContainer: $('#errorContainer'),
			errorLabelContainer: $('#errorContainer ul'),
			wrapper: 'li'
		});
	
		if ($('#AddTaskForm').valid()) {
			var taskName = $('#taskName').val();
			var taskCategory = $('#taskCategory').val();
			var taskType = $('#taskType').val();  
			var dueDate = $('#dueDate').val();
			var gradeWeight = $('#gradeWeight').val();
			var additionalNotes = $('#additionalNotes').val();
			pDB.addTask(taskName, taskType, taskCategory, gradeWeight, additionalNotes, dueDate, sendPage);
		}
	},

	handleEditForm: function() 
	{
	$("#EditTaskForm").validate
	({
		rules:
		{
			editTaskName:
			{
				required: true
			},
			editDueDate:
			{
				required: true,
				date: true
			},
			editGradeWeight:
			{
				required: true
			}
		},
		messages:
		{
			editTaskName:
			{
				required: "Please enter a task name"
			},
			editDueDate:
			{
				required: "Please enter a due date",
				date: "Invalid date entered"
			},
			editGradeWeight:
			{
				required: "Please enter a grade weight"
			}
		},
		errorContainer: $('#errorContainer'),
		errorLabelContainer: $('#errorContainer ul'),
		wrapper: 'li'
	});
	
		if ($('#EditTaskForm').valid()) 
		{
			var taskName = $('#editTaskName').val();
			var taskCategory = $('#editTaskCategory').val();
			var taskType = $('#editTaskType').val();  
			var dueDate = $('#editDueDate').val();
			var gradeWeight = $('#editGradeWeight').val();
			var additionalNotes = $('#editAdditionalNotes').val();
			pDB.editTask(taskName, taskType, taskCategory, gradeWeight, additionalNotes, dueDate);
		}
	},

	handleAddCategoryForm: function() 
	{
		$("#AddCategoryForm").validate
		({
			rules:
			{
				categoryName:
				{
					required: true
				}
			},
			message:
			{
				categoryName:
				{
					required: "Please enter a category name"
				}
			},
			errorContainer: $('#errorContainer'),
			errorLabelContainer: $('#errorContainer ul'),
			wrapper: 'li'
		});
		
		if($("#AddCategoryForm").valid())
		{
			var categoryName = $("#categoryName").val();
			pDB.addCategory(categoryName);
		}
	},

	handleAddTypeForm: function() 
	{
		$("#AddTypeForm").validate
		({
			rules:
			{
				typeName:
				{
					required: true
				}
			},
			message:
			{
				categoryName:
				{
					required: "Please enter a type name"
				}
			},
			errorContainer: $('#errorContainer'),
			errorLabelContainer: $('#errorContainer ul'),
			wrapper: 'li'
		});
		
		if($("#AddTypeForm").valid())
		{
			var typeName = $("#typeName").val();
			pDB.addType(typeName);
		}
	},
};
