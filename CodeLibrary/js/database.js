/* database.js
 * Holds the standard database functions for the application.
 *
 * Revision History
 *     Michael Couture, Jeremy Buick, 2015.04.04: Created.
 */

var pDB = {

	/* Creates the app's database tables if they don't exist. */
	createTables: function() {
		pDB.createTaskTable();
		pDB.createSubtaskTable();
		pDB.createTypeTable();
		pDB.createCategoryTable();
		pDB.initializeTypes();
		pDB.initializeCategories();
	},

	/* Creates the subtask table if it does not exist yet. */
	createSubtaskTable: function() {
		db.transaction(function(tx) {
			var sqlString = "CREATE TABLE IF NOT EXISTS subtask ("
				+ "subtask_id INTEGER PRIMARY KEY AUTOINCREMENT"
				+ ", task_id INTEGER NOT NULL"
				+ ", subtask_name VARCHAR(100) NOT NULL"
				+ ", subtask_weight INTEGER"
				+ ", notes TEXT"
				+ ", is_complete VARCHAR(1)"
				+ ", due_date DATE"
				+ ", add_date DATE"
				+ ", complete_date DATE"
				+ ", FOREIGN KEY (task_id) REFERENCES task (task_id)"
				+ ");";

			tx.executeSql(sqlString, null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Creates the task table if it does not exist yet. */
	createTaskTable: function() {
		db.transaction(function(tx) {
			var sqlString = "CREATE TABLE IF NOT EXISTS task ("
				+ "task_id INTEGER PRIMARY KEY AUTOINCREMENT"
				+ ", task_name VARCHAR(100) NOT NULL"
				+ ", type_id INTEGER NOT NULL"
				+ ", category_id INTEGER NOT NULL"
				+ ", gradeWeight INTEGER"
				+ ", notes TEXT"
				+ ", is_complete VARCHAR(1)"
				+ ", due_date DATE"
				+ ", add_date DATE"
				+ ", complete_date DATE"
				+ ", FOREIGN KEY (type_id) REFERENCES type (type_id)"
				+ ", FOREIGN KEY (category_id) REFERENCES category (category_id)"
				+ ");";

			tx.executeSql(sqlString, null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Creates the category table if it does not exist yet. */
	createCategoryTable: function() {
		db.transaction(function(tx) {
			var sqlString = "CREATE TABLE IF NOT EXISTS category ("
				+ "category_id INTEGER PRIMARY KEY AUTOINCREMENT"
				+ ", hidden VARCHAR(1)"
				+ ", category_name VARCHAR(100) NOT NULL"
				+ ");";

			tx.executeSql(sqlString, null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Creates the type table if it does not exist yet. */
	createTypeTable: function() {
		db.transaction(function(tx) {
			var sqlString = "CREATE TABLE IF NOT EXISTS type ("
				+ "type_id INTEGER PRIMARY KEY AUTOINCREMENT"
				+ ", hidden VARCHAR(1)"
				+ ", type_name VARCHAR(100) NOT NULL"
				+ ");";

			tx.executeSql(sqlString, null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Populates the category table, if it needs to be. */
	initializeCategories: function() {
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM category WHERE category_name=?", ['General'], function(tx, res) {
				if (res.rows.length === 0) {
					tx.executeSql("INSERT INTO category (category_name, hidden) VALUES (?, ?);", ['General', 'N'], pDB.dbSuccess, pDB.dbFail);
				}
			}, pDB.dbFail);
		});
	},

	/* Populates the type table, if it needs to be. */
	initializeTypes: function() {
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM type WHERE type_name=?", ['Assignment'], function(tx, res) {
				if (res.rows.length === 0) {
					tx.executeSql("INSERT INTO type (type_name, hidden) VALUES (?, ?);", ['Assignment', 'N'], pDB.dbSuccess, pDB.dbFail);
					tx.executeSql("INSERT INTO type (type_name, hidden) VALUES (?, ?);", ['Test', 'N'], pDB.dbSuccess, pDB.dbFail);
					tx.executeSql("INSERT INTO type (type_name, hidden) VALUES (?, ?);", ['Exam', 'N'], pDB.dbSuccess, pDB.dbFail);
				}
			}, pDB.dbFail);
		});
	},

	/* Fail response. */
	dbFail: function(a, b) {
		alert(b.message);
	},

	/* Success response. */
	dbSuccess: function(a, b) {
	},

	/* Drop tables (run in console). */
	dropTables: function() {
		pDB.dropSubtaskTable();
		pDB.dropTaskTable();
		pDB.dropCategoryTable();
		pDB.dropTypeTable();
	},

	/* Drop subtask table (run in console). */
	dropSubtaskTable: function() {
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE subtask", null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Drop task table (run in console). */
	dropTaskTable: function() {
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE task", null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Drop category table (run in console). */
	dropCategoryTable: function() {
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE category", null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Drop type table (run in console). */
	dropTypeTable: function() {
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE type", null, pDB.dbSuccess, pDB.dbFail);
		});
	},

	/* Populates the task type <select> list. */
	populateCategorySelect: function() {
		db.readTransaction(function(tx) {
			tx.executeSql("SELECT * FROM category WHERE hidden=? ORDER BY category_name COLLATE NOCASE;", ['N'], function(tx, results) {
				// Get the select list element.
				var selectList = $('#taskCategory');
				var editSelectList = $('#editTaskCategory');

				// Empty the current list.
				selectList.empty();
				editSelectList.empty();

				// Add the categories.
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					selectList.append($('<option></option>')
						.val(row.category_id)
						.html(row.category_name));

					editSelectList.append($('<option></option>')
						.val(row.category_id)
						.html(row.category_name));
				}

				// Refresh the list.
				selectList.selectmenu().selectmenu('refresh', true);
				editSelectList.selectmenu().selectmenu('refresh', true);

			}, pDB.dbFail);
		});
	},

	/* Populates the task type <select> list. */
	populateTypeSelect: function() {
		db.readTransaction(function(tx) {
			tx.executeSql("SELECT * FROM type WHERE hidden=? ORDER BY type_name COLLATE NOCASE;", ['N'], function(tx, results) {
				// Get the select list element.
				var selectList = $('#taskType');
				var editSelectList = $('#editTaskType');

				// Empty the current list.
				selectList.empty();
				editSelectList.empty();

				// Add the types.
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					selectList.append($('<option></option>')
						.val(row.type_id)
						.html(row.type_name));

					editSelectList.append($('<option></option>')
						.val(row.type_id)
						.html(row.type_name));
				}

				// Refresh the list.
				selectList.selectmenu().selectmenu('refresh', true);
				editSelectList.selectmenu().selectmenu('refresh', true);

			}, pDB.dbFail);
		});
	},

	/* Adds a task category. */
	addCategory: function(categoryName) {
		var sqlString = "INSERT INTO category (category_name, hidden) VALUES (?, ?);";
		
		db.transaction(function(tx) {
			tx.executeSql(sqlString, [categoryName, 'N'], function(tx, results) {
				// Reset add category form.
				$('#AddCategoryForm').trigger('reset');

				// Update list on page.
				pDB.buildCategoryList();

				// Re-populate the category select list.
				pDB.populateCategorySelect();
			}, pDB.dbFail);
		});
	},

	/* Adds a task type. */
	addType: function(typeName) {
		var sqlString = "INSERT INTO type (type_name, hidden) VALUES (?, ?);";
		
		db.transaction(function(tx) {
			tx.executeSql(sqlString, [typeName, 'N'], function(tx, results) {
				// Reset add type form.
				$('#AddTypeForm').trigger('reset');

				// Update list on page.
				pDB.buildTypeList();

				// Re-populate the type select list.
				pDB.populateTypeSelect();
			}, pDB.dbFail);
		});
	},

	/* Adds a subtask. */
	addSubtask: function(subtaskName, subtaskWeight, subtaskAdditionalNotes, subtaskDueDate) {
		var sqlString = "INSERT INTO subtask (task_id, subtask_name, subtask_weight, notes, is_complete, due_date, add_date) VALUES (?, ?, ?, ?, ?, ?, ?);";

		var today = pUtil.getToday();

		db.transaction(function(tx) {
			tx.executeSql(sqlString, [localStorage.getItem('taskId'), subtaskName, subtaskWeight, subtaskAdditionalNotes, 'N', subtaskDueDate, today], function(tx, results) {
				// Reset add subtask form.
				$('#AddSubTaskForm').trigger('reset');
				$('#subtaskWeight').slider('refresh');

				$.mobile.changePage("#ViewSubtasks");
			}, pDB.dbFail);
		});
	},

	/* Adds a task. */
	addTask: function(taskName, typeId, categoryId, gradeWeight, notes, dueDate, sendPage) {
		var sqlString = "INSERT INTO task (task_name, type_id, category_id, gradeWeight, notes, is_complete, due_date, add_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

		var today = pUtil.getToday();

		db.transaction(function(tx) {
			tx.executeSql(sqlString, [taskName, typeId, categoryId, gradeWeight, notes, 'N', dueDate, today], function(tx, results) {
				// Reset add task form.
				$('#AddTaskForm').trigger('reset');
				$('#gradeWeight').slider('refresh');
				$('#taskType').selectmenu().selectmenu('refresh', true);
				$('#taskCategory').selectmenu().selectmenu('refresh', true);

				// If the user wants to add subtasks, save the task id.
				if (sendPage === '#AddSubtasks') {
					db.transaction(function(tx) {
						tx.executeSql("SELECT task_id FROM task ORDER BY task_id DESC LIMIT 1;", null, function(tx, results) {
							var taskId;

							for (var i = 0; i < results.rows.length; i++) {
								var row = results.rows.item(i);
								taskId = row.task_id;
// LAST CHANGED STUFF HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
							}

							localStorage.setItem('taskId', taskId);

							$.mobile.changePage(sendPage);
						}, pDB.dbFail);
					});
				} else {
					$.mobile.changePage(sendPage);
				}
			}, pDB.dbFail);
		});
	},

	/* Edits an existing type. */
	editType: function() {
		var sqlString = "UPDATE type SET type_name=? WHERE type_id=?;";

		db.transaction(function(tx) {
			tx.executeSql(sqlString, [localStorage.getItem('typeId')], function(tx, results) {
				alert('Type updated.');
			}, pDB.dbFail);
		});
	},

	/* Edits an existing category. */
	editCategory: function() {
		var sqlString = "UPDATE category SET category_name=? WHERE category_id=?;";

		db.transaction(function(tx) {
			tx.executeSql(sqlString, [localStorage.getItem('categoryId')], function(tx, results) {
				alert('Category updated.');
			}, pDB.dbFail);
		});
	},

	/* Edits an existing subtask. */
	editSubtask: function(subtaskName, subtaskWeight, subtaskAdditionalNotes, subtaskDueDate) {
		var sqlString = "UPDATE subtask SET subtask_name=?, subtask_weight=?, notes=?, due_date=? WHERE subtask_id=?;";

		db.transaction(function(tx) {
			tx.executeSql(sqlString, [subtaskName, subtaskWeight, subtaskAdditionalNotes, subtaskDueDate, localStorage.getItem('subtaskId')], function(tx, results) {

				$.mobile.changePage('#ViewSubtasks');
			}, pDB.dbFail);
		});
	},

	/* Edits an existing task. */
	editTask: function(taskName, typeId, categoryId, gradeWeight, notes, dueDate) {
		var sqlString = "UPDATE task SET task_name=?, type_id=?, category_id=?, gradeWeight=?, notes=?, due_date=? WHERE task_id=?;";

		db.transaction(function(tx) {
			tx.executeSql(sqlString, [taskName, typeId, categoryId, gradeWeight, notes, dueDate, localStorage.getItem('taskId')], function(tx, results) {
				// Reset add task form.
				$('#EditTaskForm').trigger('reset');
				$('#editGradeWeight').slider('refresh');
				$('#editTaskType').selectmenu().selectmenu('refresh', true);
				$('#editTaskCategory').selectmenu().selectmenu('refresh', true);

				$.mobile.changePage('#Home');
			}, pDB.dbFail);
		});
	},

	/* Gets a list of subtasks for a task. */
	getSubtasks: function() {
		// Clear the current table contents.
		$('#subtaskTable tbody').empty();

		db.readTransaction(function(tx) {
			tx.executeSql("SELECT subtask_id, subtask_name, is_complete FROM subtask WHERE task_id=? ORDER BY is_complete, due_date", [localStorage.getItem('taskId')], function(tx, results) {
				var rowsString = "";

				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					rowsString += '<tr>'
						+ '<td>' + row.subtask_name + '</td>';

					rowsString += '<td>';
					rowsString += '<div data-role="controlgroup" data-type="horizontal" data-mini="true">';
					rowsString += '<a href="#" class="viewableSubtask" data-role="button" data-icon="info" data-row-id="' + row.subtask_id + '">Info</a>';

					if (row.is_complete === 'N') {
						rowsString += '<a href="" class="completeableSubtask" data-role="button" data-icon="check" data-theme="b" data-row-id="' + row.subtask_id + '">Complete</a>';
					}
					
					rowsString += '</div>';
					rowsString += '</td>';

					rowsString += '</tr>';
				}

				// Refresh the table to add styling.
				$("table#subtaskTable tbody")
					.append(rowsString)
					.closest("table#subtaskTable")
					.trigger("create");

				// Add event handler to complete a subtask.
				$('.completeableSubtask').on('tap', function() {
					pDB.completeSubtask(this.getAttribute('data-row-id'));
				});

				// Add event handler to view a subtask.
				$('.viewableSubtask').on('tap', function() {
					localStorage.setItem('subtaskId', this.getAttribute('data-row-id'));
					$.mobile.changePage('#EditSubtasks');
					pDB.findSubtask(this.getAttribute('data-row-id'));
				});
			}, pDB.dbFail);
		});
	},

	/* Gets a list of all tasks. */
	getTasks: function() {
		db.readTransaction(function(tx) {
			var sqlString = "SELECT tk.task_id, task_name, tp.type_name, c.category_name, tk.due_date, gradeWeight, tk.notes, COUNT(s.subtask_id) AS num_sub"
				+ " FROM task AS tk"
				+ " LEFT JOIN subtask AS s ON tk.task_id = s.task_id AND s.is_complete=?"
				+ " JOIN type AS tp ON tk.type_id = tp.type_id"
				+ " JOIN category AS c ON tk.category_id = c.category_id"
				+ " WHERE tk.is_complete=?"
				+ " GROUP BY tk.task_id"
				+ " ORDER BY tk.due_date;";

			tx.executeSql(sqlString, ['N', 'N'], function(tx, results) {
				$('#TaskList').empty();

				var htmlString = "";

				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					htmlString += '<li class="taskItem" data-icon="false" data-row-id="' + row.task_id + '">';
					htmlString += '<a href="#EditTask">';
					htmlString += '<h3>' + row.task_name + '</h3>';
					htmlString += '<p>';
					htmlString += row.category_name + ': ' + row.type_name + '<br>';
					htmlString += 'Due: ' + row.due_date + '<br>';
					htmlString += 'Weight: ' + row.gradeWeight + '%<br>';
					htmlString += row.notes;
					htmlString += '</p>';
					htmlString += '</a>';
					htmlString += '<a href="#ViewSubtasks"></a>';
					htmlString += '<span class="ui-li-count">' + row.num_sub + '</span>';

					htmlString += '</li>';
				}

				$('#TaskList').html(htmlString);
				$('#TaskList').listview('refresh');

				// Add the event handler for each task.
				$('.taskItem').on('tap', function() {
					var taskId = this.getAttribute('data-row-id');

					localStorage.setItem('taskId', taskId);
					pDB.findTask(taskId);
				});
			}, pDB.dbFail);
		});
	},

	/* Gets a list of all tasks. */
	getCompletedTasks: function() {
		db.readTransaction(function(tx) {
			var sqlString = "SELECT task_id, task_name, tp.type_name, c.category_name, due_date, complete_date, gradeWeight, notes"
				+ " FROM task AS tk"
				+ " LEFT JOIN type AS tp ON tk.type_id = tp.type_id"
				+ " LEFT JOIN category AS c ON tk.category_id = c.category_id"
				+ " WHERE is_complete=?"
				+ " ORDER BY complete_date DESC;";

			tx.executeSql(sqlString, ['Y'], function(tx, results) {
				$('#CompletedTaskList').empty();

				var htmlString = "";

				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					htmlString += '<li class="taskItem" data-row-id="' + row.task_id + '">';
					htmlString += '<h3>' + row.task_name + '</h3>';
					htmlString += '<p>';
					htmlString += row.category_name + ': ' + row.type_name + '<br>';
					htmlString += 'Completed: ' + row.complete_date + '<br>';
					htmlString += 'Weight: ' + row.gradeWeight + '%<br>';
					htmlString += row.notes;
					htmlString += '</p>';
					htmlString += '</li>';
				}

				$('#CompletedTaskList').html(htmlString);
				$('#CompletedTaskList').listview('refresh');
			}, pDB.dbFail);
		});
	},

	/* Gets the specified subtask so its details can be displayed on the edit form. */
	findSubtask: function(subtaskId) {
		db.readTransaction(function (tx) {
			tx.executeSql("SELECT * FROM subtask WHERE subtask_id = ?", [subtaskId], function(tx, results) {
				pUtil.populateEditSubtaskForm(results);
			}, pDB.dbFail);
		});
	},

	/* Gets the specified task so its details can be displayed on the edit form. */
	findTask: function(taskId) {
		db.readTransaction(function (tx) {
			tx.executeSql("SELECT * FROM task WHERE task_id = ?", [taskId], function(tx, results) {
				pUtil.populateEditForm(results);
			}, pDB.dbFail);
		});
	},

	/* Hides the specified category. */
	hideCategory: function(categoryId) {
		db.transaction(function(tx) {
			tx.executeSql("UPDATE category SET hidden=? WHERE category_id=?;", ['Y', categoryId], function(tx, results) {
			}, pDB.dbFail);
		});
	},

	/* Hides the specified type. */
	hideType: function(typeId) {
		db.transaction(function(tx) {
			tx.executeSql("UPDATE type SET hidden=? WHERE type_id=?;", ['Y', typeId], function(tx, results) {
// Update list on page.
			}, pDB.dbFail);
		});
	},

	/* Deletes the specified type. */
	deleteType: function(typeId) {
		if (confirm('Are you sure you want to delete this type?')) {
			db.transaction(function(tx) {
				tx.executeSql("DELETE FROM type WHERE type_id=?;", [typeId], function(tx, results) {
					alert('Type deleted.');

					$.mobile.changePage('#Home');
				}, pDB.dbFail);
			});
		}
	},

	/* Deletes the specified category. */
	deleteCategory: function(categoryId) {
		if (confirm('Are you sure you want to delete this category?')) {
			db.transaction(function(tx) {
				tx.executeSql("DELETE FROM category WHERE category_id=?;", [categoryId], function(tx, results) {
					alert('Category deleted.');

					$.mobile.changePage('#Home');
				}, pDB.dbFail);
			});
		}
	},

	/* Deletes the specified task. */
	deleteTask: function(taskId) {
		if (confirm('Are you sure you want to delete this task?')) {
			db.transaction(function(tx) {
				tx.executeSql("DELETE FROM task WHERE task_id=?;", [taskId], function(tx, results) {
					alert('Task deleted.');

					$.mobile.changePage('#Home');
				}, pDB.dbFail);
			});
		}
	},

	/* Marks the specified task as complete. */
	completeTask: function(taskId, showCompleteAlert) {
		// Simulate a default parameter. If the parameter is not passed, default to false.
		// I.e.: do NOT show the complete alert.
		showCompleteAlert = typeof showCompleteAlert !== 'undefined' ? showCompleteAlert: false;

		var today = pUtil.getToday();
		
		db.transaction(function(tx) {
			tx.executeSql("UPDATE task SET is_complete=?, complete_date=? WHERE task_id=?;", ['Y', today, taskId], function(tx, results) {
				if(showCompleteAlert) {
					alert('Task Complete!');
				}

				$.mobile.changePage('#Home');
			}, pDB.dbFail);
		});
	},

	/* Completes the specified subtask. */
	completeSubtask: function(subtaskId) {
		db.transaction(function(tx) {
			tx.executeSql("UPDATE subtask SET is_complete='Y' WHERE subtask_id=?;", [subtaskId], function(tx, results) {
				pDB.getSubtasks();
			}, pDB.dbFail);
		});
	},

	/* Creates the list of non-hidden categories. */
	buildCategoryList: function() {
		db.readTransaction(function(tx) {
			tx.executeSql("SELECT category_id, category_name FROM category WHERE hidden=? ORDER BY category_name COLLATE NOCASE;", ['N'], function(tx, results) {
				// Clear the current table contents.
				$('#currentCategories tbody').empty();

				var rowsString = "";

				// Add the categories.
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					rowsString += '<tr>'
						+ '<td>' + row.category_name + '</td>'
						+ '<td><a href="#" data-role="button" data-mini="true" data-icon="delete" data-theme="a" data-row-id="' + row.category_id + '" class="hideableCategory">Remove</a></td>'
						+ '</tr>';
				}
				
				// Refresh the table to add styling.
				$("table#currentCategories tbody")
					.append(rowsString)
					.closest("table#currentCategories")
					.trigger("create");

				// Add event handler to remove a category.
				$('.hideableCategory').on('tap', function() {
					pDB.hideCategory(this.getAttribute('data-row-id'));
					pDB.buildCategoryList();
					pDB.populateCategorySelect();
				});
			}, pDB.dbFail);
		});
	},

	/* Creates the list of non-hidden types. */
	buildTypeList: function() {
		db.readTransaction(function(tx) {
			tx.executeSql("SELECT type_id, type_name FROM type WHERE hidden=? ORDER BY type_name COLLATE NOCASE;", ['N'], function(tx, results) {
				// Clear the current table contents.
				$('#currentTypes tbody').empty();

				var rowsString = "";

				// Add the types.
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);

					rowsString += '<tr>'
						+ '<td>' + row.type_name + '</td>'
						+ '<td><a href="#" data-role="button" data-mini="true" data-icon="delete" data-theme="a" data-row-id="' + row.type_id + '" class="hideableType">Remove</a></td>'
						+ '</tr>';
				}
				
				// Refresh the table to add styling.
				$("table#currentTypes tbody")
					.append(rowsString)
					.closest("table#currentTypes")
					.trigger("create");

				// Add event handler to remove a type.
				$('.hideableType').on('tap', function() {
					pDB.hideType(this.getAttribute('data-row-id'));
					pDB.buildTypeList();
					pDB.populateTypeSelect();
				});
			}, pDB.dbFail);
		});
	},

};
