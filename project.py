from project_module import project_object, image_object, link_object, challenge_object

p = project_object('sliders', 'Sliding tile game solver')
p.domain = 'http://www.aidansean.com/'
p.path = 'sliders'
p.preview_image    = image_object('%s/images/project.jpg'   %p.path, 150, 250)
p.preview_image_bw = image_object('%s/images/project_bw.jpg'%p.path, 150, 250)
p.folder_name = 'aidansean'
p.github_repo_name = 'sliders'
p.mathjax = False
p.tags = 'Maths,Games'
p.technologies = 'canvas,CSS,HTML,JavaScript'
p.links.append(link_object(p.domain, 'sliders', 'Live page'))
p.introduction = 'I was playing a <a href="http://www.puzzlescript.net/play.html?p=8931824">PuzzelScript game</a> involving sliding blocks that i just couldn\'t solve.  So I wrote an algorithm to solve it.'
p.overview = '''The algorithm used is a simple backtracking algorithm to find the optimal solution (the one using the fewest moves.)  The user can create an arbitrary puzzle for solution, and then the algorithm attempts to find solutions, giving the user progress updates as it does.  Once the solution is found it's written out for the user, and the solution is animated.'''

p.challenges.append(challenge_object('The algorithm itself had to be written and optimised.', 'Although the algorithm was relatively easy to write, there is still at least error, as it fails to find a solution for a problem in 12 steps, instead giving a solution in 13 steps.  This error has yet to be found.  By optimising a few steps, the algorithm was significantly improved.', 'Resolved, to be revisited'))

p.challenges.append(challenge_object('The user should be able to create their own puzzles.', 'This was achieved quite easily using my experience making tile based games.  I used all the normal mouse event listeners.', 'Resolved'))

p.challenges.append(challenge_object('The solution is animated.', 'It turns out that animating the solution was relatively easy once the graphics had been made.  The steps are handled using the normal <code>window.setTimeout</code> method.', 'Resolved'))

p.challenges.append(challenge_object('The algorithm should not max out the user\'s CPU for more than 30 seconds.', 'Using the user\'s CPU for too long causes alerts to be raised in most browsers.  The algorithm takes time to sleep as it progresses using the <code>window.setTimeout</code> method to free up the user\'s CPU from time to time.', 'Resolved'))

p.challenges.append(challenge_object('The progress is animated.', 'I\'ve used CSS based progress bars in the past before, but this is the first time I\'d animated them.  The only hard part here was estimating the number of possible combinations of \(n\) moves, and then scaling the bars accordingly.', 'Resolved'))
