var documenterSearchIndex = {"docs":
[{"location":"#disCovErr.jl-Documentation","page":"disCovErr.jl Documentation","title":"disCovErr.jl Documentation","text":"","category":"section"},{"location":"","page":"disCovErr.jl Documentation","title":"disCovErr.jl Documentation","text":"","category":"page"},{"location":"","page":"disCovErr.jl Documentation","title":"disCovErr.jl Documentation","text":"CurrentModule = disCovErr","category":"page"},{"location":"","page":"disCovErr.jl Documentation","title":"disCovErr.jl Documentation","text":"Modules = [disCovErr]\nOrder   = [:function, :type]","category":"page"},{"location":"#disCovErr.add_sky_noise!-NTuple{4, Any}","page":"disCovErr.jl Documentation","title":"disCovErr.add_sky_noise!","text":"add_sky_noise!(testim2,maskim0,skyim3,gain;seed=2021)\n\nAdds noise to the infill that matches the Poisson noise of a rough estimate for the sky background. A random seed to set a local random generator is provided for reproducible unit testing.\n\nArguments:\n\ntestim2: input image which had infilling\nmaskim0: mask of pixels which were infilled\nskyim3: rough estimate of sky background counts\ngain: gain of detector to convert from photon count noise to detector noise\nseed: random seed for random generator\n\n\n\n\n\n","category":"method"},{"location":"#disCovErr.boxsmoothMod!-Tuple{Any, Any, Int64, Int64, Int64, Int64}","page":"disCovErr.jl Documentation","title":"disCovErr.boxsmoothMod!","text":"boxsmoothMod!(out, arr, widx::Int, widy::Int, sx::Int, sy::Int)\n\nBoxcar smooths an input image (or paddedview) arr with window size widx by widy. We pass the original image size sx and sy to help handle image views.\n\nArguments:\n\nout: preallocated output array for the boxcar smoothed image\narr: input array for which boxcar smoothing is computed (generally paddedview)\nwidx::Int: size of boxcar smoothing window in x\nwidy::Int: size of boxcar smoothing window in y\nsx::Int: x size of the original (unpadded) image\nsy::Int: y size of the original (unpadded) image\n\n\n\n\n\n","category":"method"},{"location":"#disCovErr.condCovEst_wdiag-NTuple{8, Any}","page":"disCovErr.jl Documentation","title":"disCovErr.condCovEst_wdiag","text":"condCovEst_wdiag(cov_loc,μ,k,kstar,kpsf2d,data_in,data_w,stars_in) -> [std_w std_wdiag var_wdb resid_mean pred_mean chi20]\n\nUsing a local covariance matrix estimate cov_loc and a set of known pixels k and unknown pixels kstar, this function computes a prediction for the mean value of the kstar pixels and the covariance matrix of the kstar pixels. In terms of statistics use to adjust the photometry of a star, we are only interested in the pixels masked as a result of the star (i.e. not a detector defect or cosmic ray nearby) which is kpsf2d. The residual image data_in, the weight image data_w, and a model of the counts above the background coming from the star stars_in for the local patch are also inputs of the function. Correction factors for the photometric flux and flux uncertainities are outputs as well as the chi2 value for the predicted pixels.\n\nArguments:\n\ncov_loc: local covariance matrix\nμ: vector containing mean value for each pixel in the patch\nk: unmasked pixels\nkstar: masked pixels\nkpsf2d: pixels masked due to the star of interest\ndata_in: residual image in local patch\ndata_w: weight image in local patch\nstars_in: image of counts from star alone in local patch\n\n\n\n\n\n","category":"method"},{"location":"#disCovErr.cov_construct-Tuple{Any, Any, Any}","page":"disCovErr.jl Documentation","title":"disCovErr.cov_construct","text":"cov_construct(img, cx, cy; Np::Int=33, widx::Int=129, widy::Int=129) -> cov, μ\n\nConstruct a local covariance matrix estimate from img centered around pixel cx and cy. The covariance matrix will be for a square subimage of size Np by Np pixels, yielding cov of size Np^2. The covariance matrix is estimated by taking samples over pixels within a box of size widx and widy centered on the pixel of interest.\n\nIf cx and cy are arrays, the first index of the returned cov will be the index of the center point and μ will be the same length as cx.\n\nIn the interest of speed for the case of wanting to construct the covariance matrix at many posiitons, the moving mean of the full input image (times shifts of the input image) is precomputed for every entry of the covariance matrix. This may not be efficient for few cx.\n\nNote that the values of widx and widy determine how local an estimate the covariance matrix returned is, but for too small of values of widx and widy, the covariance matrix estimate may be singular (one should always keep Np^2 < widx*widy).\n\nArguments:\n\nimg: Input image for which we desire the covariance matrix estimate\ncx: x position (or positions) at which we want a covariance matrix estimate\ncy: y position (or positions) at which we want a covariance matrix estimate\nNp: size of the image stamp for which the covariance matrix will be estimated\nwidx: size of sampled region in x used to estimate entries in the covariance matrix\nwidy: size of sampled region in y used to estimate the entries in the covariance matrix\n\n\n\n\n\n","category":"method"},{"location":"#disCovErr.gen_mask_staticPSF!","page":"disCovErr.jl Documentation","title":"disCovErr.gen_mask_staticPSF!","text":"gen_mask_staticPSF!(maskd, psfstamp, x_stars, y_stars, flux_stars, thr=20)\n\nGenerate a mask for an input image (which is usually an image of model residuals) that excludes the cores of stars (which are often mismodeled). In this function, we use a fixed PSF psfstamp for all sources, and adjust the masking fraction based on the stellar flux and a threshold thr. A more general position dependent PSF model could be used with a slight generalization of this function, but is likely overkill for the problem of making a mask.\n\nArguments:\n\nmaskd: bool image to which mask will be added (bitwise or)\npsfstamp: simple 2D array of a single PSF to be used for the whole image\nx_stars: list of source x positions\ny_stars: list of source y positions\nflux_stars: list of source fluxes\nthr: threshold used for flux-dependent masking\n\n\n\n\n\n","category":"function"},{"location":"#disCovErr.prelim_infill!-NTuple{7, Any}","page":"disCovErr.jl Documentation","title":"disCovErr.prelim_infill!","text":"prelim_infill!(testim,maskim,bimage,bimageI,testim2, maskim2, goodpix; widx = 19, widy=19)\n\nThis intial infill replaces masked pixels with a guess based on a smoothed boxcar. For large masked regions, the smoothing scale is increased. If this iteration takes too long/requires too strong of masking, the masked pixels are replaced with the median of the image.\n\nWe use 3 copies of the input image and mask image. The first is an untouched view (with reflective boundary condition padding), the second is allocated to hold various smoothings of the image, and the third holds the output image which contains our best infill guess. A final bool array of size corresponding to the image is used to keep track of pixels that have safe infill values.\n\nArguments:\n\ntestim: input image which requires infilling\nbimage: preallocated array for smoothed version of input image\ntestim2: inplace modified ouptut array for infilled version of image input\nmaskim: input mask indicating which pixels require infilling\nbimageI: preallocated array for smoothed mask counting the samples for each estimate\nmaskim2: inplace modified mask to keep track of which pixels still need infilling\nwidx::Int: size of boxcar smoothing window in x\nwidy::Int: size of boxcar smoothing window in y\n\n\n\n\n\n","category":"method"},{"location":"#disCovErr.read_crowdsource-NTuple{5, Any}","page":"disCovErr.jl Documentation","title":"disCovErr.read_crowdsource","text":"read_crowdsource(base,date,filt,vers,ccd) -> x_stars, y_stars, decapsid, gain, mod_im, sky_im\n\nRead in outputs of crowdsource, a photometric pipeline. To pair with an arbitrary photometric pipeline, an analogous read in function should be created. The relevant outputs are the model image (including the sources) so that we can produce the residual image, the sky/background model (no sources), and the coordinates of the stars. The survey id number is also readout of the pipeline solution file to help cross-validate matching of the disCovErr outputs and the original sources. The emperical gain is read out of the header (for other photometric pipelines which don't perform this estiamte, the gain from DECam is likely sufficient).\n\nArguments:\n\nbase: parent directory and file name prefix for crowdsource results files\ndate: date_time of the exposure\nfilt: optical filter used to take the exposure\nvers: NOAO community processing version number\nccd: which ccd we are pulling the image for\n\n\n\n\n\n","category":"method"},{"location":"#disCovErr.read_decam-NTuple{5, Any}","page":"disCovErr.jl Documentation","title":"disCovErr.read_decam","text":"read_decam(base,date,filt,vers,ccd) -> ref_im, w_im, d_im\n\nRead in raw image files associated with exposures obtain on the DarkEnergyCamera. Returns the image, a weighting image, and a quality flag mask image. See NOAO handbook for more details on what is contained in each file and how they are obtained.\n\nArguments:\n\nbase: parent directory and file name prefix for exposure files\ndate: date_time of the exposure\nfilt: optical filter used to take the exposure\nvers: NOAO community processing version number\nccd: which ccd we are pulling the image for\n\nExample\n\nref_im, w_im, d_im = read_decam(\"/n/fink2/decaps/c4d_\",\"170420_040428\",\"g\",\"v1\",\"N14\")\n\n\n\n\n\n","category":"method"}]
}
