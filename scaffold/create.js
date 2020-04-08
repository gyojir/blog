const fs = require('fs');
const yaml = require('js-yaml');
const inquirer = require('inquirer');
const shortid = require('shortid');
const path = require('path');

const ls = (dir, regex) => {
  const files = fs.readdirSync(dir);
  return files.filter((file) =>
    fs.statSync(path.join(dir,file)).isFile() && regex.test(file)); //絞り込み  
}

module.exports = async (args, options, logger) => {
  const templateDir = path.join(__dirname, "../templates");

  // 引数でテンプレートが指定されていない場合は選ぶ
  let templateFilename = args.template;
  if(!templateFilename){
    const result = await inquirer.prompt([{type: "list", "name": "template", choices: ls(templateDir, /.*\.yml$/)}]);
    templateFilename = result.template;
  }
  const templatePath = path.join(templateDir,templateFilename);

  // ない
  if (!fs.existsSync(templatePath)) {
    logger.error(`The requested template for ${args.template} wasn't found.`)
    process.exit(1);
  }

  const template = yaml.safeLoad(fs.readFileSync(`${templatePath}`, 'utf8'));
  const variables = template.variables;
  
  logger.info('Please fill the following values…');
  let result = await inquirer.prompt(variables.map(v=> ({type: "input", name: v})));

  // 組み込み関数
  result = {
    ...result,
    __date: new Date().toISOString(),
    __id: shortid.generate()
  }

  // 置換して書き込み
  template.files.forEach(e=>{
    const replace = (str)=>{
      return Object.entries(result).reduce((prev, [v,res]) => 
        prev.replace(new RegExp(`%${v}%`, "gi"), res), str);
    };
    
    const filePath = replace(e.path);
    const dirname = path.dirname(filePath);
    const content = replace(e.content);

    logger.info(`write file to ${filePath}`);
    
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  });
  logger.info('✔ Success!');
};