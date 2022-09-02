use std::{fs, path::PathBuf};
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
#[structopt(name = "widl-parser", about = "Command line WIDL parser")]
struct Opt {
    /// Input file
    #[structopt(parse(from_os_str))]
    input: PathBuf,
}

fn main() {
    let opt = Opt::from_args();
    match run(opt.input) {
        Ok(_) => (),
        Err(e) => eprintln!("Error: {}", e.to_string()),
    };
}

fn run(path: PathBuf) -> anyhow::Result<()> {
    let widl = fs::read_to_string(path)?;
    let doc = widl_parser::parse_widl_src(&widl)?;
    println!("{}", serde_json::to_string_pretty(&doc)?);
    Ok(())
}
