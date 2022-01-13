using cloudCovErr
using Documenter

makedocs(
    clean=true,
    highlightsig = true,
    sitename= "cloudCovErr.jl",
)

deploydocs(
    repo = "github.com/andrew-saydjari/cloudCovErr.jl.git",
    branch = "gh-pages",
    devbranch = "main"
)
