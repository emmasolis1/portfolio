#!/bin/bash
#TOPOLOGY=generate_topology.py
TOPOLOGY=generate_topology-group.py
GRAPH_GENERATOR=show_network.py
PROVINCE_ROUTER=Inter_provincial_router.py
CANTON_ROUTER=Intra_provincial_router.py
HEALTH_AREA_SERVER=Area_Server.py
CLIENT=client.py
PROVINCES=$1
CANTONES=$2
AREASALUD=$3

# Reviews that the users entered the 3 required arguments.
function analize_arguments {
  echo "Info receive correctly:"
  echo "-Provinces: $PROVINCES"
  echo "-Regions (cantones): $CANTONES"
  echo "-Health Areas: $AREASALUD"
}

# Calls the python file that created the red_config file.
function prepare_docs {
  # Invoke python file.
  echo "Creating network topology..."
  python3 $TOPOLOGY $PROVINCES $CANTONES $AREASALUD
}

function run_servers_terminals {
  # TODO: call province servers.
  for node in `seq 1 $PROVINCES`
  do
    gnome-terminal -e "bash -c \" python3 $PROVINCE_ROUTER $node; exec bash\""
  done


  # Call to cantonal routers.
  for node in `seq 1 $PROVINCES`
  do
    for subnode in `seq 1 $CANTONES`
    do
      gnome-terminal -e "bash -c \" python3 $CANTON_ROUTER $node $subnode; exec bash\""
    done
  done

  # Call to province routers.
  HEALTH_INITIAL_PORT=6000
  for node in `seq 1 $PROVINCES`
  do
    for subnode in `seq 1 $CANTONES`
    do
      COUNTER=6000
      for subsubnode in `seq 1 $PROVINCES`
      do
        gnome-terminal -e "bash -c \" python3 $HEALTH_AREA_SERVER $node $subnode $subsubnode $HEALTH_INITIAL_PORT; exec bash\""
        HEALTH_INITIAL_PORT=$((HEALTH_INITIAL_PORT+1))
      done
    done
  done
}

function show_topology_graph {
  echo "Creating network's topology graph..."
  python3 $GRAPH_GENERATOR $PROVINCES $CANTONES $AREASALUD
}

function main {
  analize_arguments
  prepare_docs
  run_servers_terminals
  #TODO run_clients_terminals
  show_topology_graph
}

# Main code:
main
