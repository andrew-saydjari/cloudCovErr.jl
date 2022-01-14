var documenterSearchIndex = {"docs":
[{"location":"api/#API-Reference","page":"API Reference","title":"API Reference","text":"","category":"section"},{"location":"api/#Covariance-Construction-Functions","page":"API Reference","title":"Covariance Construction Functions","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"cov_avg!\nboxsmooth!\noutest_bounds","category":"page"},{"location":"api/#cloudCovErr.cov_avg!","page":"API Reference","title":"cloudCovErr.cov_avg!","text":"cov_avg!(bimage, ism, bism, in_image; Np::Int=33, widx::Int=129, widy::Int=129, ftype::Int=32)\n\nKey function for constructing the (shifted and multiplied) versions of the input image used to quickly estimate the local covariance matrix at a large number of locations. The main output is in the preallocated bism which is used as an input to build_cov!.\n\nArguments:\n\nbimage: preallocated output array for the boxcar smoothed unshifted image\nism: preallocated intermediate array for the input image times itself shifted\nbism: preallocated output array to store boxcar-smoothed image products for all shifts\nin_image: input image the local covariance of which we want to estimate\n\nKeywords:\n\nNp::Int: size of local covariance matrix in pixels (default 33)\nwidx::Int: width of boxcar window in x which determines size of region used for samples for the local covariance estimate (default 129)\nwidy::Int: width of boxcar window in y which determines size of region used for samples for the local covariance estimate (default 129)\nftype::Int: determine the Float precision, 32 is Float32, otherwise Float64\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.boxsmooth!","page":"API Reference","title":"cloudCovErr.boxsmooth!","text":"boxsmooth!(out::AbstractArray, arr::AbstractArray, tot::Array{T,1}, widx::Int, widy::Int)\n\nBoxcar smooths an input image (or paddedview) arr with window size widx by widy. We pass the original image size sx and sy to help handle image views.\n\nArguments:\n\nout::AbstractArray: preallocated output array for the boxcar smoothed image\narr::AbstractArray: input array for which boxcar smoothing is computed (generally paddedview)\ntot::Array{T,1}: preallocated array to hold moving sums along 1 dimension\nwidx::Int: size of boxcar smoothing window in x\nwidy::Int: size of boxcar smoothing window in y\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.outest_bounds","page":"API Reference","title":"cloudCovErr.outest_bounds","text":"outest_bounds(cx,sx) -> px0\n\nHelper function to find maximum padding in pixels required to accomodate all query points cx outside of the image size 1:sx.\n\nArguments:\n\ncx: list of integer star centers (in either x or y)\nsx: image dimension along the axis indexed by cx\n\nOutputs:\n\npx0: maximum padding in pixels required to accomodate all query points\n\n\n\n\n\n","category":"function"},{"location":"api/#Per-Star-Functions","page":"API Reference","title":"Per Star Functions","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"stamp_cutter\ngen_pix_mask\ncondCovEst_wdiag\nbuild_cov!","category":"page"},{"location":"api/#cloudCovErr.stamp_cutter","page":"API Reference","title":"cloudCovErr.stamp_cutter","text":"stamp_cutter(cx,cy,residimIn,star_im,maskim;Np=33) -> data_in, stars_in, kmasked2d\n\nCuts out local stamps around each star of the various input images to be used for per star statistics calculations.\n\nArguments:\n\ncx: center coorindate x of the stamp\ncy: center coorindate y of the stamp\nresidimIn: residual image with infilling from which covariance was estimated\nstar_im: input image of model of stars only. abs(modim-skyim)\nmaskim: input image of upstream masked pixels\n\nKeywords:\n\nNp: size of covariance matrix footprint around each star (default 33)\n\nOutputs:\n\ndata_in: local stamp of the (non-infilled) residual image\nstars_in: local stamp of model of stars only\nkmasked2d: local stamp of upstream masked pixels\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.gen_pix_mask","page":"API Reference","title":"cloudCovErr.gen_pix_mask","text":"gen_pix_mask(kmasked2d,psfmodel,circmask,x_star,y_star,flux_star;Np=33,thr=20) -> psft, kstar[:], kpsf2d, kcond0, kcond, kpred, dnt\n\nAssigns pixels in the local subimage around a star to either be \"good\", \"hidden\", or \"ignored\" based on user settings and the flux of the star. Reads in masked pixels from the quality flags on pixels coming from the community pipeline kmasked2d, a PSF model for the star, and a precomputed circular mask circmask to exclude pixels at a large radius from the stellar center since they have little impact on the regression of hidden pixels. The pixels assigned as \"hidden\" and to be interpolated are determined by a thr on the pixel values for flux_star times the PSF model. We use a parametric PSFs that varies with position and query the PSF at the stellar position for each star.\n\nArguments:\n\nkmasked2d: Bool mask from upstream pixel quality flags to assign pixels as \"ignored\"\npsfmodel: parametric PSF model that can be queried at different positions\ncircmask: static Bool mask assigning pixels beyond some radius of the stellar center as \"ignored\"\nx_star: x-coordinate of the star (used only for flexible PSF model query)\ny_star: y-coordinate of the star (used only for flexible PSF model query)\nflux_star: flux of star in ADU to determine how large a region to make \"hidden\"\n\nKeywords:\n\nNp: size of local covariance matrix in pixels (default 33)\nthr: threshold for psf-based masking of the residuals (larger more \"hidden\")\n\nOutputs:\n\npsft: static array (image) of the stellar PSF\nkstar: Boolean indexes the NOT \"good\" pixels\nkpsf2d: Boolean indexes the \"hidden\" pixels\nkcond0: initial number of \"good\" pixels\nkcond: final number of \"good\" pixels after fallbacks\nkpred: the number of pixels \"hidden\"\ndnt: quality flag bits on the solution\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.condCovEst_wdiag","page":"API Reference","title":"cloudCovErr.condCovEst_wdiag","text":"condCovEst_wdiag(cov_loc,μ,km,kpsf2d,data_in,stars_in,psft;Np=33,export_mean=false,n_draw=0,diag_on=true) -> out\n\nUsing a local covariance matrix estimate cov_loc and a set of known (\"good\") pixels km and \"hidden\" pixels kpsf2d, this function computes a prediction for the mean value of the kpsf2d pixels and the covariance matrix of the kpsf2d pixels. In terms of statistics use to adjust the photometry of a star, we are only interested in the pixels masked as a result of the star (i.e. not a detector defect or cosmic ray nearby). The residual image data_in and a model of the counts above the background coming from the star stars_in for the local patch are also inputs of the function. Correction factors for the photometric flux and flux uncertainities are outputs as well as a chi2 value for the \"good\" pixels. The output list can conditionally include the mean reconstruction and draws from the distribution of reconstructions.\n\nArguments:\n\ncov_loc: local covariance matrix\nμ: vector containing mean value for each pixel in the patch\nkm: unmasked pixels\nkpsf2d: pixels masked due to the star of interest\ndata_in: (non-infilled) residual image in local patch\npsft: static array (image) of the stellar PSF\n\nKeywords:\n\nNp: size of local covariance matrix in pixels (default 33)\nexport_mean: when true, returns the mean conditional prediction for the \"hidden\" pixels (default false)\nn_draw: when nonzero, returns that number of realizations of the conditional infilling (default 0)\ndiag_on: flag for adding to the pixelwise uncertainty based on the photoelectron counts of the modeled star (default true)\n\nOutputs:\n\nout[1]: flux uncertainity of the star\nout[2]: flux uncertainity of the star assuming the covariance matrix were diagonal\nout[3]: flux correction which must be added to correct the input flux estimate\nout[4]: flux correction coming from the residuals (fdb_res)\nout[5]: flux correction coming from the predicted background (fdb_pred)\nout[6]: chi2 for the \"good\" pixels under cov_loc as a metric on how good our assumptions are\nout[7]: local region (image) with \"hidden\" pixels replaced by the mean conditional estimate (optional output)\nout[end:end+n_draw]: local region (image) with \"hidden\" pixels replaced by the draws from the conditional distribution (optional output)\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.build_cov!","page":"API Reference","title":"cloudCovErr.build_cov!","text":"build_cov!(cov::Array{T,2},μ::Array{T,1},cx::Int,cy::Int,bimage::Array{T,2},bism::Array{T,4},Np::Int,widx::Int,widy::Int) where T <:Union{Float32,Float64}\n\nConstructs the local covariance matrix and mean for an image patch of size Np x Np pixels around a location of interest (cx,cy). The construction is just a lookup of pixel values from the stored boxcar-smoothed copies of the input image times itself shifted in bism. Passing the smoothed image bimage and the widths of the boxcar mean widx and widy is helpful for the mean and normalization. The covariance and mean are updated in place for speed since this operation may be performed billions of times since we construct a new covariance matrix for every detection. Math may either be performed Float32 or Float64.\n\nArguments:\n\ncov::Array{T,2}: preallocated output array for local covariance matrix\nμ::Array{T,1}: preallocated output vector for local mean\ncx::Int: x-coordinate of the center of the local region\ncy::Int: y-coordinate of the center of the local region\nbimage::Array{T,2}: boxcar smoothed unshifted image\nbism::Array{T,4}: boxcar-smoothed image products for all shifts\nNp::Int: size of local covariance matrix in pixels\nwidx::Int: width of boxcar window in x which determines size of region used for samples for the local covariance estimate\nwidy::Int: width of boxcar window in y which determines size of region used for samples for the local covariance estimate\n\n\n\n\n\n","category":"function"},{"location":"api/#Image-Infill-and-Masking","page":"API Reference","title":"Image Infill and Masking","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"prelim_infill!\ngen_mask_staticPSF!\ngen_mask_staticPSF2!\nim_subrng\nadd_sky_noise!\nadd_noise!\nfindmaxpsf\nkstar_circle_mask","category":"page"},{"location":"api/#cloudCovErr.prelim_infill!","page":"API Reference","title":"cloudCovErr.prelim_infill!","text":"prelim_infill!(testim,bmaskim,bimage,bimageI,testim2,bmaskim2,goodpix,ccd;widx=19,widy=19,ftype::Int=32,widmult=1.4)\n\nThis intial infill replaces masked pixels with a guess based on a smoothed boxcar. For large masked regions, the smoothing scale is increased. If this iteration takes too long/requires too strong of masking, the masked pixels are replaced with the median of the image.\n\nWe use 3 copies of the input image and mask image. The first is a view (with reflective boundary condition padding) with the pixels to be infilled replaced with zeros, the second is allocated to hold various smoothings of the image, and the third holds the output image which contains our best infill guess. A final Bool array of size corresponding to the image is used to keep track of pixels that have safe infill values.\n\nArguments:\n\ntestim: input image which requires infilling\nbmaskim: input mask indicating which pixels require infilling\nbimage: preallocated array for smoothed version of input image\nbimageI: preallocated array for smoothed mask counting the samples for each estimate\ntestim2: inplace modified ouptut array for infilled version of image input\nbmaskim2: inplace modified mask to keep track of which pixels still need infilling\ngoodpix: preallocated array for Bool indexing pixels with good infill\nccd: string name of FITS extension for verbose cmdline printing\n\nKeywords:\n\nwidx: initial size of boxcar smoothing window in x (default 19)\nwidy: initial size of boxcar smoothing window in y (default 19)\nftype::Int: determine the Float precision, 32 is Float32, otherwise Float64\nwidmult: multiplicative factor for increasing the smoothing scale at each iteration step\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.gen_mask_staticPSF!","page":"API Reference","title":"cloudCovErr.gen_mask_staticPSF!","text":"gen_mask_staticPSF!(maskd, psfstamp, x_stars, y_stars, flux_stars, thr=20)\n\nGenerate a mask for an input image (which is usually an image of model residuals) that excludes the cores of stars (which are often mismodeled). In this function, we use a fixed PSF psfstamp for all sources, and adjust the masking fraction based on the stellar flux and a threshold thr. A more general position dependent PSF model could be used with a slight generalization of this function, but is likely overkill for the problem of making a mask.\n\nArguments:\n\nmaskd: bool image to which mask will be added (bitwise or)\npsfstamp: simple 2D array of a single PSF to be used for the whole image\nx_stars: list of source x positions\ny_stars: list of source y positions\nflux_stars: list of source fluxes\n\nKeywords:\n\nthr: threshold used for flux-dependent masking (default 20)\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.gen_mask_staticPSF2!","page":"API Reference","title":"cloudCovErr.gen_mask_staticPSF2!","text":"gen_mask_staticPSF2!(maskd, psfstamp, psfstamp1, x_stars, y_stars, flux_stars, thr=20)\n\nGenerate a mask for an input image (which is usually an image of model residuals) that excludes the cores of stars (which are often mismodeled). In this function, we use a small fixed PSF psfstamp1 for all faint sources, and adjust the masking fraction based on the stellar flux and a threshold thr. Only for source bright enough to need a larger PSF stamp do we use psfstamp, which saves some computational cost.\n\nArguments:\n\nmaskd: bool image to which mask will be added (bitwise or)\npsfstamp: simple 2D array of a single PSF to be used for bright stars in the whole image\npsfstamp1: simple 2D array of a single PSF to be used for faint stars in the whole image\nx_stars: list of source x positions\ny_stars: list of source y positions\nflux_stars: list of source fluxes\n\nKeywords:\n\nthr: threshold used for flux-dependent masking (default 20)\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.im_subrng","page":"API Reference","title":"cloudCovErr.im_subrng","text":"im_subrng(jx,jy,cx,cy,sx,sy,px0,py0,stepx,stepy,padx,pady,tilex,tiley) -> xrng, yrng, star_ind\n\nComputes the flux a star must have so that the PSF-based masking using thr would require a larger stamp area. Used for computational savings.\n\nArguments:\n\njx: tile index along x\njy: tile index along y\ncx: list of stellar x-coordinates\ncy: list of stellar y-coordinates\nsx: size of original image in x\nsy: size of original image in y\npx0: maximal padding in x to account for stars outside image\npy0: maximal padding in y to account for stars outside image\nstepx: tiling step size in x\nstepy: tiling step size in y\npadx: tile padding in x required to account for local stamp size, sample size, and pixels outside the image\npady: tile padding in x required to account for local stamp size, sample size, and pixels outside the image\ntilex: total number of tile divisions along x\ntiley: total number of tile divisions along y\n\nOutputs:\n\nxrng: slicing range of the tile in x\nyrng: slicing range of the tile in y\nstar_ind: Bool mask of all stars falling within the tile (subimage)\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.add_sky_noise!","page":"API Reference","title":"cloudCovErr.add_sky_noise!","text":"add_sky_noise!(testim2,maskim,skyim,gain;seed=2021)\n\nAdds noise to the infill that matches the Poisson noise of a rough estimate for the sky background. A random seed to set a local random generator is provided for reproducible unit testing.\n\nArguments:\n\ntestim2: input image which had infilling\nmaskim: mask of pixels which were infilled\nskyim: rough estimate of sky background counts\ngain: gain of detector to convert from photon count noise to detector noise\n\nKeywords:\n\nseed: random seed for random generator\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.findmaxpsf","page":"API Reference","title":"cloudCovErr.findmaxpsf","text":"findmaxpsf(psfstamp1;thr=20) -> flim\n\nComputes the flux a star must have so that the PSF-based masking using thr would require a larger stamp area. Used for computational savings.\n\nArguments:\n\npsfstamp1: a small image of a representative PSF\n\nKeywords:\n\nthr: threshold used to determine which pixels are bright enough to be \"hidden\"\n\nOutputs:\n\nflim: maximum flux that can be masked by thr without exceeding the PSF stamp footprint\n\n\n\n\n\n","category":"function"},{"location":"api/#cloudCovErr.kstar_circle_mask","page":"API Reference","title":"cloudCovErr.kstar_circle_mask","text":"kstar_circle_mask(Np;rlim=256) -> circmask\n\nGenerates a Bool mask for pixels beyond a given (squared) radius of the center of an image.\n\nArguments:\n\nNp: size of image stamp\n\nKeywords:\n\nrlim: squared radius (in pixels^2) beyond which pixels should be masked (default 256)\n\nOutputs:\n\ncircmask: static Bool mask used for assigning pixels beyond some radius of the stellar center as \"ignored\"\n\n\n\n\n\n","category":"function"},{"location":"api/#DECam-Specific-Functions","page":"API Reference","title":"DECam Specific Functions","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"read_decam\nread_crowdsource\ninject_rename\nload_psfmodel_cs\nsave_fxn\nget_catnames\nproc_ccd\nproc_all","category":"page"},{"location":"#cloudCovErr.jl","page":"Introduction","title":"cloudCovErr.jl","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"CurrentModule = cloudCovErr","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"(Image: GitHub) (Image: Build Status) [(Image: Coverage Status)(https://codecov.io/github/andrew-saydjari/cloudCovErr.jl?branch=main)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"A Julia package for debiasing and improving error bar estimates for photometry on top of structured/filamentary background.","category":"page"},{"location":"#Installation","page":"Introduction","title":"Installation","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"cloudCovErr.jl can be installed using the built-in package manager","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"pkg> add cloudCovErr","category":"page"},{"location":"#Usage","page":"Introduction","title":"Usage","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"using cloudCovErr","category":"page"},{"location":"#Table-of-Contents","page":"Introduction","title":"Table of Contents","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"","category":"page"}]
}