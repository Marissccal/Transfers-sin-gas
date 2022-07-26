# Meta-Transacciones

## Guild
### Paso 1: Ejecutar Hardhat Network
Ubicar terminal en **token_contracts**

- `yarn` para instalar dependencias
- `npx hardhat node` para ejecutar la red hardhat y el servidor JSON-RPC en http://127.0.0.1:8545
- `npx hardhat run --network localhost scripts/deployMetaTransaction.js` para implementar el contrato de metatransacciones

### Paso 2: Correr el Relay Server
Ubicar terminal en **relay-server**

- `yarn` para instalar dependencias.
- `node main.js` para ejecutar las escuchas de la app en http://localhost:3000




### Paso 3: Correr el frontend
Ubicar terminal en carpeta **wallet-vue**

- `yarn` para instalar dependencias.
- `npx vue-cli-service serve` para correr el frontend de la app en http://localhost:8080
- Puede abrir el explorador y dirigirse al devtool **console**.
- En su wallet de Metamask, importe una (o dos) dev account(s) de la hardhat network:

```
Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

- Puede usar Rinkeby o cualquier testnet para interactuar con la dapp.
- Use la cuenta addr1 con metamask y vuelva a cargar la página para ver las **data** correctas en las consola del navegador.
- complete los cuadros de entrada sobre la dirección "to" y el "amount" a transferir.
- presione "sign" para firmar la transacción, y podrá ver la firma tanto en la página como en la consola.
- presione "transfer", y podra ver la "signature sent" en la consola.


