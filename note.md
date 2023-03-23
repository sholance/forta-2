For the second bot, you would 

subscribe to the alerts from the first bot and 

raise an alert when you observe X or more alerts from the first bot. 

You would likely extract the EOA of the scammer from each alert and put the corresponding alertID into a dictionary. Once the dictionary shows X or more unique alertIDs, you would trigger an alert from this second bot.

Of course I am making the assumption that one alert from the base bot does not have sufficient evidence to conclude its bad, but more conditions need to be met. You should take a look at a few examples to understand what is a good value for X.

I would also recommend to take a look at a few tokens that are prominent and well established today and see what they looked like when they were initially created. We dont want to trigger on those types of tokens, right?