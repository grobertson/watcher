# Watcher
A simple node daemon to watch an arbitrary file or directory of files, detect the changed file(s), and trigger an action for each change.

# Features and Benefits 

- Deleted files trigger a change event. Now smart enough not to choke on deletion, with or without an additional change in the scan.
- Polling interval can be adjusted between 1000 and ???? ms. Below 1000ms is not suggested. 
- Correctly detects *all* changes between polls by comparing mtimes to the lastCheck time, this eliminates an extremely rare but possible edge case in which multiple files updated within 100s of milliseconds of one another could lead to an undetected change.
- Avoids use of Linux specific inotify API
- Minimal node modules required. (Currently requires log-timestamp, could easily be removed leaving watcher entirely dependency free


# To Do / What's Missing?

- Could read a config file with poll time, directory(ies) to monitor
- Could gracefully handle an array of directories, such that n directories can be handled with 1 to 1 process to pod ratio
