import type { HashOptions } from "../src/index";

export type Props = {
  options?: HashOptions
}
type ToProps = (options: HashOptions) => Props
type GetProps = (key: string, options: Props) => Props

export const toProps : ToProps = (options) => {
  return {options}
}

export const getAllOptions = () => {
  return new Map<string, HashOptions>([
    ["default", {}],
    ["#hash/", {hashRoot: ""}],
    ["#/hash/", {hashRoot: "/"}],
    ["#!/hash/", {hashRoot: "!/"}],
    ["#hash#", {hashRoot: "", hashSlash: "#"}],
    ["#/hash#", {hashRoot: "/", hashSlash: "#"}],
    ["#!/hash|", {hashRoot: "!/", hashSlash: "|"}]
  ])
}

export const getAllProps = (options?: HashOptions) => {
  const optionList = [...getAllOptions().entries()]
  return new Map<string, Props>(optionList.map(([key, opts]) => {
    return [key, toProps({...opts, ...options})]
  }))
}

export const getProps: GetProps = (key, options = {}) => {
  return getAllProps(options).get(key)
}
