import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function resolvePath(contractsPath: string) {
  return {
    interfaces: path.resolve(contractsPath, 'src', 'artifacts', 'contracts', 'uniswapv2', 'interfaces'),
    implementations: path.resolve(contractsPath, 'src', 'artifacts', 'contracts', 'uniswapv2')
  }
}

function copy(abis: string[], abiPath: string) {
  for (const abi of abis) {
    const dir = path.resolve(abiPath, abi)
    const abis = fs.readdirSync(dir)
    const prodAbis = abis.filter((abi) => abi.indexOf('dbg.json') === -1)
    const prodAbisPaths = prodAbis.map((abi) => {
      return {
        from: path.resolve(dir, abi),
        to: path.resolve('abis', abi)
      }
    })
    for (const { from, to } of prodAbisPaths) {
      fs.createReadStream(from).pipe(fs.createWriteStream(to))
    }
  }
}

const abis = {
  interfaces: [
    'IERC20.sol',
    'IUniswapV2ERC20.sol',
    'IUniswapV2Factory.sol',
    'IUniswapV2Pair.sol',
    'IUniswapV2Router02.sol',
    'IWETH.sol'
  ],
  implementations: ['UniswapV2ERC20.sol', 'UniswapV2Factory.sol', 'UniswapV2Router02.sol', 'UniswapV2Pair.sol']
}

;(function () {
  const contractsPath = path.resolve('..', 'manekiswap-contracts')
  execSync(`yarn --cwd ${contractsPath} compile`)
  const { interfaces, implementations } = resolvePath(contractsPath)

  copy(abis.interfaces, interfaces)
  copy(abis.implementations, implementations)
})()
