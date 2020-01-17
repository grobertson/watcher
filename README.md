# Watcher
A simple node daemon to watch an arbitrary file or directory of files, detect the changed file(s), and trigger an action for each change.

# Features and Benefits 

- Deleted files trigger a change event. Now smart enough not to choke on deletion, with or without an additional change in the scan.
- Polling interval can be adjusted between 1000 and ???? ms. Below 1000ms is not suggested. 
- Correctly detects *all* changes between polls by comparing mtimes to the lastCheck time, this eliminates an extremely rare but possible edge case in which multiple files updated within 100s of milliseconds of one another could lead to an undetected change.
- Avoids use of Linux specific inotify API
- Minimal node modules required. (Currently requires log-timestamp, could easily be removed leaving watcher entirely dependency free


# To Do / What's Missing?

- Should read a config file with poll time, directory(ies) to monitor
- Should gracefully handle an array of directories, such that n directories can be handled with 1 to 1 process to pod ratio
- How will pod notifications work.
- If notifications come from watcher, watcher will need to be able to identify the nodes in the cluster


# Pod Notification Ideas

- (Best) Completely integrate the watcher into application running in k8, let each container manage its own config reload on chnage detection, use symlinks to configmap. Something like: 1) Change symlink 2) fs change detected 3) re-initialize.
- (Better) Add api endpoint to atlas which triggers a configuration reload without restart, Use "PostStart" and "PreStop" lifecycle hooks to maintain a list of active cluster nodes, make request to that endpoint from watcher.js
- (Good) Call kube commands to manage cluster refresh


