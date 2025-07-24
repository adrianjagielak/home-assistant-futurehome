/// Returns the adapter address of the device associated with the given service address.
/// The service address may belong to any service on the device.
export function adapterAddressFromServiceAddress(
  serviceAddress: string,
): string {
  const parts = serviceAddress.split('/');

  if (parts.length < 4) {
    throw new Error('Invalid address format');
  }

  const adapterPart = parts[2]; // e.g., "rn:zigbee"
  const adapterName = adapterPart.split(':')[1]; // "zigbee"
  const adPart = parts[3]; // e.g., "ad:1"

  return `/rt:ad/rn:${adapterName}/${adPart}`;
}

/// Returns the adapter service name of the device associated with the given service address.
/// The service address may belong to any service on the device.
export function adapterServiceFromServiceAddress(
  serviceAddress: string,
): string {
  const parts = serviceAddress.split('/');

  if (parts.length < 3) {
    throw new Error('Invalid address format');
  }

  const adapterPart = parts[2]; // e.g., "rn:zigbee"
  const adapterName = adapterPart.split(':')[1]; // "zigbee"

  if (adapterName === 'zw') {
    return 'zwave-ad';
  }

  return adapterName;
}

export function replaceSvcInAddr(addr: string, newService: string): string {
  return addr.replace(/\/sv:[^/]+/, `/sv:${newService}`);
}
