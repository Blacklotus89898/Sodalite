# Entry point to launch the applications

show_help() {
    echo "Usage: $0 [-f] [-e] [-a] [-h]"
    echo "  -f    Launch front end"
    echo "  -e    Launch back end"
    echo "  -a    Launch application"
    echo "  -h    Show help"
    echo "  fe    Launch front end and back end"
}

launch_frontend() {
    echo "Launching front end in tmux pane 1..."
    tmux send-keys -t mysession:0.0 "cd sodalite-web-front && npm i && npm run dev" C-m
}

launch_backend() {
    echo "Launching back end in tmux pane 2..."
    tmux send-keys -t mysession:0.1 "cd sodalite-web-back/websocketserver && npm i && npm start" C-m
}

create_tmux_session() {
    echo "Creating tmux session 'mysession' with two panes..."
    tmux new-session -d -s mysession -n mywindow
    tmux split-window -h
}

while getopts "feah" opt; do
    case $opt in
        f)
            create_tmux_session
            launch_frontend
            ;;
        e)
            create_tmux_session
            launch_backend
            ;;
        a)
            echo "Launching application..."
            # Add commands to launch application here
            ;;
        h)
            show_help
            exit 0
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            show_help
            exit 1
            ;;
    esac
done

shift $((OPTIND -1))

if [ "$1" == "fe" ]; then
    create_tmux_session
    launch_frontend
    launch_backend
elif [ $OPTIND -eq 1 ]; then
    show_help
fi
