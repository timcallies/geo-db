To submit code to this repository all you have to do is send us a pull request.
But make sure your code meets the following requirements.   
*  Your commit messages clearly describe the change you requesting.   
*  Your code is somewhat readable, with comments only when neccessary.   
*  There is some kind of test that we can use to make sure that your code works.   
  
If your code meets all those requirements, it works, and we like the change, we will accept your pull request. 
If you don't know how to use git refer to the following [tutorial](https://zachmsorenson.github.io/tutorials/github).   
From that tutorial I've included one section that helps you get familar with creating forks and using pull requests. 



Submitting code with pull requests.
--------------------------------------

When you are all finished writting your code, the typical method for
submiting your code (especially for open source projects) is through
submitting a pull request to the person that is maintaining the
repostiory where the project you are working on is stored. Here is the
methodology to do so.

1.  Create a fork of the repostiory that you want to work on. You can do
	this by hitting the "Fork" button in the upper right hand of the
	page of the repository that you want to do work on. This is
	basically just cloning your own copy of the repository, and then
	putting that into a new repositry that you own.
2.  From there you will get your own version of that repo that is now
	under your github name. Clone the version under your name onto your
	machine.
3.  Use ```git add, git commit, and git push``` to make chages to your forked
	repository.
4.  Sidenote: If you need to pull down upstream changes from the
	original repository, then you might have to add the original
	repository as a remote to your project. To do this do the following.
	1.  Navigate into your repository on your machine.
	2.  Commit all your changes.
	3.  run the command: ```git remote add <name> <url> ```

		with the name you want to use to refer to the repo, and the url
		of the original repository that you want to pull down changes
		from.

	4.  pull down the changes: ``git pull origin <name>``

		where name is the name of the remote repository that you want to
		pull changes from. You can use ```git remote -v```

		to view all of the remote repositories that you have added to
		your project.

	5.  If the upstream repo made changes to the same bit of code that
		you have, you might have to solve for a merge conflict.

5.  Once you have made all your changes and you are ready to submit your code, you will go to the github page of the original repository.

6.  Click on the "New Pull Request" button that is next to the button where you select the branch you are viewing.

7.  Click on "Compare accross forks"

8.  You will want to merge your forked repository into this repository, so make sure the base is the branch you want to merge into, and the compare is your fork, and compare is the branch you want to merge into the base branch.

9.  From there you will hit "Create pull request", then the maintainers of the repository will review your code, and if it is good enough they will accept your merge request and add your code into their repository. However, often times the maintainer may ask you to change something, or fix a bug before he/she pulls your code into their codebase, so make sure your code is well tested, and looks good!

