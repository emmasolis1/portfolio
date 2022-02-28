import matplotlib.pyplot as plt
import networkx as nx
import sys

# Used to print graph
def read_conf(graph, color_dictionary, color_list, provinces_counter, canton_counter, healthareas_counter):
  file = open("red_conf.csv", "r")
  primary_counter = 0
  auxiliar_counter = 0

  assign_provinces = 0
  assign_cantones = 0

  number_of_runs = 1 # to know if I am assigning provincia, canton, o area de salud.

  # Using readlines()
  Lines = file.readlines()

  type = True
  for line in Lines:
    if line.strip() == "nodes":
      type = True
    else:
      if line.strip() == "edges":
        type = False
      else:        
        if type == True:
          tok = line.strip().split(",")
          if assign_provinces == provinces_counter and number_of_runs == 1:
            primary_counter += 1
            auxiliar_counter += 1
            assign_provinces = 0
            number_of_runs = 2
          elif assign_provinces == provinces_counter and number_of_runs == 2:
            provinces_counter = canton_counter
            primary_counter += 1
            number_of_runs = 3
          elif assign_provinces == provinces_counter and number_of_runs == 3:
            provinces_counter = healthareas_counter
            primary_counter += 1
            number_of_runs = 1
          graph.add_node(str(tok[0]))
          assign_provinces += 1
          try:
            color_list.append(color_dictionary[primary_counter])
          except IndexError:
            if auxiliar_counter >= canton_counter or auxiliar_counter >= healthareas_counter:
              auxiliar_counter = 0
            primary_counter = 1 + auxiliar_counter
            color_list.append(color_dictionary[primary_counter])
        else:
          tok = line.strip().split(",")
          graph.add_edge(str(tok[0]), str(tok[1]))
          assign_cantones += 1
          if assign_cantones >= canton_counter:
            primary_counter += 1
            assign_cantones = 0

  file.close()

# Effect: Create a configuration file with a random topology
# Requires: valid number of provincial, valid number of cantonal routers for each provincial router
# Modify: red_conf.csv
if __name__ == "__main__":
  # set node count for each graph
  inter_provincial_count = int(sys.argv[1])
  intra_provincial_count = int(sys.argv[2])
  health_area_count = int(sys.argv[3])
  colors = ['blue', 'orange', 'green', 'yellow', 'black', 'brown', 'red', 'pink', 'gray', 'turquoise', 'violet', 'darkblue', 'purple', 'cyan']
  graph_colors = list()

  #print what was created with generate_topology.py
  final_topology_graph = nx.Graph()
  read_conf(final_topology_graph, colors, graph_colors, inter_provincial_count, intra_provincial_count, health_area_count)
  nx.draw(final_topology_graph, node_color=graph_colors)
  plt.show()
