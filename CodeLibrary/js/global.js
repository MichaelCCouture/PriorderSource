/* global.js
 * Holds the standard global functions for the application.
 *
 * Revision History
 *     Michael Couture, Jeremy Buick, 2015.04.04: Created.
 */

var db;

/* onReady function for the app. */
$(document).ready(function() {

	// Open the database.
	db = openDatabase('PriorderDb', '1.0', 'Priorder DB', 2 * 1024 * 1024);

	// Create the tables, if necessary.
	pDB.createTables();

	// Populate the select lists.
	pDB.populateTypeSelect();
	pDB.populateCategorySelect();

	// Display the list of tasks initially.
	pDB.getTasks();

	// Add event handler to display the task list on the appropriate page.
	$('#Home').on('pageshow', pDB.getTasks);
	$('#ViewSubtasks').on('pageshow', pDB.getSubtasks);
	$('#CompletedTaskPage').on('pageshow', pDB.getCompletedTasks);

	// Add event handler to display the current types/categories list on the appropriate page.
	$('#AddType').on('pageshow', pDB.buildTypeList);
	$('#AddCategory').on('pageshow', pDB.buildCategoryList);

	// Validate form input on submit.
	$('#submitSubtask').on('tap', pUtil.handleAddSubtaskForm);
	$('#editSubmitSubtask').on('tap', pUtil.handleEditSubtaskForm);

	$('#submitTaskAddSubtasks').on('tap', function() {
		pUtil.handleAddForm('#AddSubtasks');
	});

	$('#submitTask').on('tap', function() {
		pUtil.handleAddForm('#Home');
	});

	$('#editSubmitTask').on('tap', pUtil.handleEditForm);
	$('#submitCategory').on('tap', pUtil.handleAddCategoryForm);
	$('#submitType').on('tap', pUtil.handleAddTypeForm);

	// Complete and delete task buttons on the edit page.
	$('#editTaskComplete').on('tap', function() {
		pDB.completeTask(localStorage.getItem('taskId'), false);
	});

	$('#editTaskDelete').on('tap', function() {
		pDB.deleteTask(localStorage.getItem('taskId'), true);
	});
});
