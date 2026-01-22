![penguins](https://github.com/cs4804-24c/a2-DataVis-5Ways/assets/412089/accc5680-3c77-4d29-9502-d3ff8cd922af)

# 02-DataVis-5ways

Assignment 2 - Data Visualization, 5 Ways  
===

## d3

![d3](./d3-plot/d3-plot.png)

Notes:
- D3 requires more code to create the desired plot, but it is extremely customizable and flexible.
- With enough effort, you can replicate everything exactly as you want it. 

## Mosaic

I started with the `vanilla-example` from https://github.com/uwdata/mosaic. I also referenced the mosaic examples like https://idl.uw.edu/mosaic/examples/symbols.html.

## Matplotlib / Seaborn

![Matplotlib-Seaborn](./python-matplotlib/matplotlib-scatterplot.png)

Notes:
- The colors are not exactly the same as the original due to differences in default color palettes between ggplot2 and Seaborn. I tried to match purple manually since it was the most different.
- The legend is clearly different in style. I placed it to the right side so it is similar to the original. 
- The legend uses greater granularity for the sizes.
- I had to add some custom code to get the point outlines to match their fill instead of being white.

## R + ggplot2

![R-ggplot2](./r-ggplot2/Rplot.png)

Notes:
- Since the original graphic was created with ggplot2, the R + ggplot2 version is nearly identical to the original.

## Altair

![Altair](./python-altair/altair-scatterplot.png)

Notes:
- The colors are not exactly the same as the original due to differences in default color palettes between ggplot2 and Altair. 
- The legend is different in style, but placed similarly to the seaborn version.
- It required more specific customization to mimic the gray grid theme of the original.
- Working with Altair was very nice since it is very customizable and has a clean API.
