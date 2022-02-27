// Copyright 2022 Emmanuel D. Solis. University of Costa Rica.

#ifndef GENETIC_ALGORITHM_H
#define GENETIC_ALGORITHM_H
class GeneticAlgorithm{
	protected:
		float elitismRatio, mutationRatio, sporadicRatio;
		unsigned int currentEpoch, populationSize;
	public:
		//GeneticAlgorithm(int populationSize,float elitismRatio,float mutationRatio,float sporadicRatio);
        GeneticAlgorithm(int populationSize,float elitismRatio,float mutationRatio,float sporadicRatio);
        ~GeneticAlgorithm();
		unsigned int getEpoch();
		virtual void reset(int populationSize,float elitismRatio,float mutationRatio,float sporadicRatio);
		virtual void epoch()=0;
		virtual float getBestIndividual()=0;
};
#endif
